using UnityEngine;

public class GuardPatrol : MonoBehaviour
{
    public float minX = 7.2f;
    public float maxX = 13.4f;
    public float speed = 1.35f;
    public bool down;
    float dir = 1f;
    SpriteRenderer sprite;

    void Awake()
    {
        TryGetComponent(out sprite);
    }

    void Update()
    {
        if (down) return;
        var p = transform.position;
        p.x += dir * speed * Time.deltaTime;
        if (p.x > maxX) { p.x = maxX; dir = -1f; }
        if (p.x < minX) { p.x = minX; dir = 1f; }
        transform.position = p;
        if (sprite != null) sprite.flipX = dir < 0f;
    }

    public void Drop()
    {
        down = true;
        transform.rotation = Quaternion.Euler(0f, 0f, -70f);
    }
}
