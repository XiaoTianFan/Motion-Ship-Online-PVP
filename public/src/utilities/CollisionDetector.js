class CollisionDetector {
  // Check collision between two spherical objects
  static checkSphereCollision(obj1, obj2) {
    let distance = dist(obj1.x, obj1.y, obj1.z, obj2.x, obj2.y, obj2.z);
    return distance < (obj1.colliderRadius + obj2.colliderRadius);
  }
}