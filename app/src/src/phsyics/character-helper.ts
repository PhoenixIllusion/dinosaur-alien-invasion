import { Vector3, Quaternion, Camera } from 'three';
import Jolt from 'jolt-physics';

interface VirtualCharacterParameter {
  camera: Camera,
  jolt: Jolt.JoltInterface,
  physicsSystem: Jolt.PhysicsSystem,
  getShape: () => Jolt.Shape,
  characterContactListener?: Jolt.CharacterContactListenerJS
}

const createVirtualCharacter = (opts: VirtualCharacterParameter) => {

	const { jolt, physicsSystem, characterContactListener, getShape } = opts;

	const JPH_PI = 3.14159265358979323846;
	const DegreesToRadians = (deg: number) => deg * (JPH_PI / 180.0);

	const sControlMovementDuringJump = true;
	const sCharacterSpeed = 6.0;
	const sJumpSpeed = 15.0;

	const sEnableCharacterInertia = true;

	const sBackFaceMode = Jolt.CollideWithBackFaces;
	const sUpRotationX = 0;
	const sUpRotationZ = 0;
	const sMaxSlopeAngle = DegreesToRadians(45.0);
	const sMaxStrength = 100.0;
	const sCharacterPadding = 0.02;
	const sPenetrationRecoverySpeed = 1.0;
	const sPredictiveContactDistance = 0.1;
	const sEnableWalkStairs = true;
	const sEnableStickToFloor = true;

	let mCharacter: Jolt.CharacterVirtual;
	let mAllowSliding = false;

	let mDesiredVelocity = new Vector3();

	const update_settings = new Jolt.ExtendedUpdateSettings();

	const objectVsBroadPhaseLayerFilter = jolt.GetObjectVsBroadPhaseLayerFilter();
	const objectLayerPairFilter = jolt.GetObjectLayerPairFilter();


	const movingBPFilter = new Jolt.DefaultBroadPhaseLayerFilter(objectVsBroadPhaseLayerFilter, Jolt.MOVING);
	const movingLayerFilter = new Jolt.DefaultObjectLayerFilter(objectLayerPairFilter, Jolt.MOVING);
	const bodyFilter = new Jolt.BodyFilter();
	const shapeFilter = new Jolt.ShapeFilter();

	const wrapVec3 = (joltVec3: Jolt.Vec3) => new Vector3(joltVec3.GetX(), joltVec3.GetY(), joltVec3.GetZ());
	const wrapQuat = (q: Jolt.Quat) => new Quaternion(q.GetX(), q.GetY(), q.GetZ(), q.GetW());

	const initialize = () => {
		const settings = new Jolt.CharacterVirtualSettings();
		settings.mMass = 1000;
		settings.mMaxSlopeAngle = sMaxSlopeAngle;
		settings.mMaxStrength = sMaxStrength;
		settings.mShape = getShape();
		settings.mBackFaceMode = sBackFaceMode;
		settings.mCharacterPadding = sCharacterPadding;
		settings.mPenetrationRecoverySpeed = sPenetrationRecoverySpeed;
		settings.mPredictiveContactDistance = sPredictiveContactDistance;
		settings.mSupportingVolume = new Jolt.Plane(Jolt.Vec3.sAxisY(), -1);
		mCharacter = new Jolt.CharacterVirtual(settings, Jolt.Vec3.sZero(), Jolt.Quat.sIdentity(), physicsSystem);

		if(characterContactListener) {
			mCharacter.SetListener(characterContactListener);
		}
	}

	const prePhysicsUpdate = (mDeltaTime: number) => {
		const characterUp = wrapVec3(mCharacter.GetUp());
		if (!sEnableStickToFloor) {
			update_settings.mStickToFloorStepDown = Jolt.Vec3.sZero();
		}
		else {
			const vec = characterUp.clone().multiplyScalar(-update_settings.mStickToFloorStepDown.Length());
			update_settings.mStickToFloorStepDown = new Jolt.Vec3(vec.x, vec.y, vec.z);
		}

		if (!sEnableWalkStairs) {
			update_settings.mWalkStairsStepUp = Jolt.Vec3.sZero();
		}
		else {
			const vec = characterUp.clone().multiplyScalar(update_settings.mWalkStairsStepUp.Length());
			update_settings.mWalkStairsStepUp = new Jolt.Vec3(vec.x, vec.y, vec.z);
		}
		characterUp.multiplyScalar(-physicsSystem.GetGravity().Length());
		mCharacter.ExtendedUpdate(mDeltaTime,
			new Jolt.Vec3(characterUp.x, characterUp.y, characterUp.z),
			update_settings,
			movingBPFilter,
			movingLayerFilter,
			bodyFilter,
			shapeFilter,
			jolt.GetTempAllocator());
	}

	const handleInput = (inMovementDirection: Vector3, inJump: boolean, inDeltaTime: number) => {
		const player_controls_horizontal_velocity = sControlMovementDuringJump || mCharacter.IsSupported();
		if (player_controls_horizontal_velocity) {
			// True if the player intended to move
			mAllowSliding = !(inMovementDirection.length() < 1.0e-12);
			// Smooth the player input
			if (sEnableCharacterInertia) {
				mDesiredVelocity.multiplyScalar(0.75).add(inMovementDirection.multiplyScalar(0.25 * sCharacterSpeed))
			} else {
				mDesiredVelocity.copy(inMovementDirection).multiplyScalar(sCharacterSpeed);
			}
		}
		else {
			// While in air we allow sliding
			mAllowSliding = true;
		}
		const character_up_rotation = Jolt.Quat.sEulerAngles(new Jolt.Vec3(sUpRotationX, 0, sUpRotationZ));
		mCharacter.SetUp(character_up_rotation.RotateAxisY());
		mCharacter.SetRotation(character_up_rotation);
		const upRotation = wrapQuat(character_up_rotation);

		mCharacter.UpdateGroundVelocity();
		const characterUp = wrapVec3(mCharacter.GetUp());
		const linearVelocity = wrapVec3(mCharacter.GetLinearVelocity());
		const current_vertical_velocity = characterUp.clone().multiplyScalar(linearVelocity.dot(characterUp));
		const ground_velocity = wrapVec3(mCharacter.GetGroundVelocity());
		const gravity = wrapVec3(physicsSystem.GetGravity());

		let new_velocity;
		const moving_towards_ground = (current_vertical_velocity.y - ground_velocity.y) < 0.1;
		if (mCharacter.GetGroundState() == Jolt.OnGround	// If on ground
			&& (sEnableCharacterInertia ?
				moving_towards_ground													// Inertia enabled: And not moving away from ground
				: !mCharacter.IsSlopeTooSteep(mCharacter.GetGroundNormal())))			// Inertia disabled: And not on a slope that is too steep
		{
			// Assume velocity of ground when on ground
			new_velocity = ground_velocity;

			// Jump
			if (inJump && moving_towards_ground)
				new_velocity.add(characterUp.multiplyScalar(sJumpSpeed));
		}
		else
			new_velocity = current_vertical_velocity.clone();


		// Gravity
		new_velocity.add(gravity.multiplyScalar(inDeltaTime).applyQuaternion(upRotation));

		if (player_controls_horizontal_velocity) {
			// Player input
			new_velocity.add(mDesiredVelocity.clone().applyQuaternion(upRotation));
		}
		else {
			// Preserve horizontal velocity
			const current_horizontal_velocity = linearVelocity.sub(current_vertical_velocity);
			new_velocity.add(current_horizontal_velocity);
		}

		mCharacter.SetLinearVelocity(new Jolt.Vec3(new_velocity.x, new_velocity.y, new_velocity.z));
	}

	initialize();

  return { prePhysicsUpdate, handleInput, mAllowSliding }
}



export { createVirtualCharacter };