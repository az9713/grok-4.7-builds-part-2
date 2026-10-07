using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = 3.1f;
    public SpriteRenderer sprite;
    public Animator animator;
    Rigidbody2D body;
    Vector2 input;

    void Awake()
    {
        body = GetComponent<Rigidbody2D>();
        if (sprite == null) TryGetComponent(out sprite);
    }

    void Update()
    {
        input = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
        if (input.sqrMagnitude > 1f) input.Normalize();
        if (sprite != null && Mathf.Abs(input.x) > 0.01f) sprite.flipX = input.x < 0f;
        if (animator != null) animator.SetBool("Moving", input.sqrMagnitude > 0.01f);
        if (Input.GetKeyDown(KeyCode.Space))
        {
            var takedown = GetComponent<Takedown>();
            if (takedown != null) takedown.TryStrike();
        }
    }

    void FixedUpdate()
    {
        if (body == null) return;
        body.MovePosition(body.position + input * speed * Time.fixedDeltaTime);
    }
}
