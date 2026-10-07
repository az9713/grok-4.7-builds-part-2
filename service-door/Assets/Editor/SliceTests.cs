using NUnit.Framework;
using UnityEditor.SceneManagement;
using UnityEngine;

public class SliceTests
{
    const string ScenePath = "Assets/Scenes/ServiceDoor.unity";

    [Test]
    public void TakedownRadiusIsPositive()
    {
        var go = new GameObject("player");
        var t = go.AddComponent<Takedown>();
        Assert.Greater(t.radius, 0f);
        Object.DestroyImmediate(go);
    }

    [Test]
    public void GuardStartsUp()
    {
        var go = new GameObject("guard");
        var g = go.AddComponent<GuardPatrol>();
        Assert.IsFalse(g.down);
        Object.DestroyImmediate(go);
    }

    [Test]
    public void SceneHasOneGuard()
    {
        EditorSceneManager.OpenScene(ScenePath);
        var guards = Object.FindObjectsByType<GuardPatrol>(FindObjectsInactive.Exclude, FindObjectsSortMode.None);
        Assert.AreEqual(1, guards.Length);
        Assert.IsFalse(guards[0].down);
    }

    [Test]
    public void SceneSpawnsOnePlayer()
    {
        EditorSceneManager.OpenScene(ScenePath);
        var players = Object.FindObjectsByType<PlayerController>(FindObjectsInactive.Exclude, FindObjectsSortMode.None);
        Assert.AreEqual(1, players.Length);
        Assert.Greater(players[0].transform.position.x, 0f);
        var takedown = players[0].GetComponent<Takedown>();
        Assert.IsNotNull(takedown);
        Assert.Greater(takedown.radius, 0f);
        Assert.IsNotNull(players[0].GetComponent<Rigidbody2D>());
    }

    [Test]
    public void ElevatorTriggerExists()
    {
        EditorSceneManager.OpenScene(ScenePath);
        var wins = Object.FindObjectsByType<ElevatorWin>(FindObjectsInactive.Exclude, FindObjectsSortMode.None);
        Assert.AreEqual(1, wins.Length);
        var col = wins[0].GetComponent<Collider2D>();
        Assert.IsNotNull(col);
        Assert.IsTrue(col.isTrigger);
        Assert.IsNotNull(wins[0].player);
        Assert.IsNotNull(wins[0].guard);
    }
}
