using UnityEngine;

public class Takedown : MonoBehaviour
{
    public float radius = 1.15f;
    public GuardPatrol guard;

    public void TryStrike()
    {
        if (guard == null || guard.down) return;
        if (Vector2.Distance(transform.position, guard.transform.position) <= radius)
            guard.Drop();
    }
}
