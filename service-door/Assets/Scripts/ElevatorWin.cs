using UnityEngine;
using UnityEngine.SceneManagement;

public class ElevatorWin : MonoBehaviour
{
    public static bool Won { get; private set; }
    public Transform player;
    public GuardPatrol guard;

    void OnTriggerEnter2D(Collider2D other)
    {
        if (player == null) return;
        if (other.transform != player && !other.transform.IsChildOf(player)) return;
        if (guard != null && !guard.down) return;
        Won = true;
    }

    void Update()
    {
        if (Won && Input.GetKeyDown(KeyCode.R))
        {
            Won = false;
            SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
        }
    }
}
