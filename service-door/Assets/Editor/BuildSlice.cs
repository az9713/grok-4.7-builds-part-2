using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.SceneManagement;
using UnityEditor.U2D.Sprites;
using UnityEngine;
using UnityEngine.Tilemaps;

public static class BuildSlice
{
    const int Cols = 20;
    const int Rows = 11;
    const string ScenePath = "Assets/Scenes/ServiceDoor.unity";

    [MenuItem("Tools/Build Service Door Slice")]
    public static void Run()
    {
        if (!Application.isBatchMode && !EditorSceneManager.SaveCurrentModifiedScenesIfUserWantsTo())
            return;

        Directory.CreateDirectory(Path.Combine(Application.dataPath, "Art", "Imported"));
        Directory.CreateDirectory(Path.Combine(Application.dataPath, "Art", "Clips"));
        Directory.CreateDirectory(Path.Combine(Application.dataPath, "Scenes"));
        AssetDatabase.Refresh();

        CopyImport("hero-idle.png");
        CopyImport("hero-walk.png");
        CopyImport("guard-full.png");
        CopyImport("elevator-clean.png");
        CopyImport("shelf.png");
        CopyImport("floor.jpg");
        CopyImport("wall.jpg");

        SliceSheet("Assets/Art/Imported/hero-idle.png", "hero-idle", 8, 192, 48f);
        SliceSheet("Assets/Art/Imported/hero-walk.png", "hero-walk", 8, 192, 48f);
        ImportSingle("Assets/Art/Imported/guard-full.png");
        ImportSingle("Assets/Art/Imported/elevator-clean.png");
        ImportSingle("Assets/Art/Imported/shelf.png");
        ImportSingle("Assets/Art/Imported/floor.jpg");
        ImportSingle("Assets/Art/Imported/wall.jpg");

        var idle = Sprites("Assets/Art/Imported/hero-idle.png");
        var walk = Sprites("Assets/Art/Imported/hero-walk.png");
        if (idle.Length != 8 || walk.Length != 8)
            throw new System.InvalidOperationException("hero sheets must slice to 8 sprites, got " + idle.Length + " and " + walk.Length);

        var idleClip = MakeClip("Assets/Art/Clips/HeroIdle.anim", idle, 6f);
        var walkClip = MakeClip("Assets/Art/Clips/HeroWalk.anim", walk, 10f);
        var controller = MakeController(idleClip, walkClip);

        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

        var camGo = new GameObject("Main Camera");
        camGo.tag = "MainCamera";
        var cam = camGo.AddComponent<Camera>();
        cam.orthographic = true;
        cam.orthographicSize = Rows * 0.5f;
        cam.transform.position = new Vector3(Cols * 0.5f, Rows * 0.5f, -10f);
        cam.backgroundColor = new Color(0.13f, 0.14f, 0.16f);
        cam.clearFlags = CameraClearFlags.SolidColor;
        camGo.AddComponent<AudioListener>();

        BuildTiles();

        var shelves = new[]
        {
            new Vector4(5f, 2f, 2f, 3f),
            new Vector4(5f, 7f, 2f, 3f),
            new Vector4(11f, 2f, 2f, 3f),
            new Vector4(11f, 7f, 2f, 3f)
        };
        var shelfSprite = AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Art/Imported/shelf.png");
        foreach (var s in shelves)
        {
            var go = new GameObject("Shelf");
            go.transform.position = new Vector3(s.x + s.z * 0.5f, s.y + s.w * 0.5f, 0f);
            var sr = go.AddComponent<SpriteRenderer>();
            sr.sprite = shelfSprite;
            go.transform.localScale = new Vector3(s.z, s.w, 1f);
            var box = go.AddComponent<BoxCollider2D>();
            box.size = Vector2.one;
        }

        var guard = new GameObject("Guard");
        guard.transform.position = new Vector3(8f, 5.2f, 0f);
        var gsr = guard.AddComponent<SpriteRenderer>();
        gsr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Art/Imported/guard-full.png");
        gsr.sortingOrder = 8;
        guard.transform.localScale = FitHeight(gsr.sprite, 1.7f);
        var patrol = guard.AddComponent<GuardPatrol>();
        patrol.minX = 7.2f;
        patrol.maxX = 13.4f;
        patrol.speed = 1.35f;

        var player = new GameObject("Player");
        player.transform.position = new Vector3(2.2f, 5.2f, 0f);
        var body = player.AddComponent<Rigidbody2D>();
        body.gravityScale = 0f;
        body.constraints = RigidbodyConstraints2D.FreezeRotation;
        var pcol = player.AddComponent<BoxCollider2D>();
        pcol.size = new Vector2(0.7f, 0.9f);
        var psr = player.AddComponent<SpriteRenderer>();
        psr.sprite = idle[0];
        psr.sortingOrder = 10;
        player.transform.localScale = FitHeight(idle[0], 1.65f);
        var anim = player.AddComponent<Animator>();
        anim.runtimeAnimatorController = controller;
        var pc = player.AddComponent<PlayerController>();
        pc.speed = 3.1f;
        pc.sprite = psr;
        pc.animator = anim;
        var takedown = player.AddComponent<Takedown>();
        takedown.radius = 1.15f;
        takedown.guard = patrol;

        var lift = new GameObject("Elevator");
        lift.transform.position = new Vector3(17.2f + 1.1f, 4.1f + 1.6f, 0f);
        var esr = lift.AddComponent<SpriteRenderer>();
        esr.sprite = AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Art/Imported/elevator-clean.png");
        esr.sortingOrder = 2;
        lift.transform.localScale = new Vector3(2.2f, 3.2f, 1f);
        var trigger = lift.AddComponent<BoxCollider2D>();
        trigger.isTrigger = true;
        trigger.size = Vector2.one;
        var win = lift.AddComponent<ElevatorWin>();
        win.player = player.transform;
        win.guard = patrol;

        EditorSceneManager.MarkSceneDirty(scene);
        EditorSceneManager.SaveScene(scene, ScenePath);
        EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
        AssetDatabase.SaveAssets();
        Debug.Log("SLICE_BUILD_OK");
        if (Application.isBatchMode) EditorApplication.Exit(0);
    }

    static void CopyImport(string fileName)
    {
        string project = Path.GetDirectoryName(Application.dataPath);
        string src = Path.Combine(project, "play", "art", fileName);
        string dest = Path.Combine(Application.dataPath, "Art", "Imported", fileName);
        File.Copy(src, dest, true);
        AssetDatabase.ImportAsset("Assets/Art/Imported/" + fileName);
    }

    static void SliceSheet(string assetPath, string prefix, int cells, int cellSize, float ppu)
    {
        var importer = (TextureImporter)AssetImporter.GetAtPath(assetPath);
        importer.textureType = TextureImporterType.Sprite;
        importer.spriteImportMode = SpriteImportMode.Multiple;
        importer.filterMode = FilterMode.Point;
        importer.mipmapEnabled = false;
        importer.textureCompression = TextureImporterCompression.Uncompressed;
        importer.alphaIsTransparency = true;
        importer.spritePixelsPerUnit = ppu;
        var factory = new SpriteDataProviderFactories();
        factory.Init();
        var provider = factory.GetSpriteEditorDataProviderFromObject(importer);
        provider.InitSpriteEditorDataProvider();
        var rects = new SpriteRect[cells];
        for (int i = 0; i < cells; i++)
        {
            rects[i] = new SpriteRect
            {
                name = prefix + "_" + i,
                spriteID = GUID.Generate(),
                rect = new Rect(i * cellSize, 0, cellSize, cellSize),
                alignment = SpriteAlignment.BottomCenter,
                pivot = new Vector2(0.5f, 0f)
            };
        }
        provider.SetSpriteRects(rects);
        provider.Apply();
        importer.SaveAndReimport();
    }

    static void ImportSingle(string assetPath)
    {
        var importer = (TextureImporter)AssetImporter.GetAtPath(assetPath);
        importer.textureType = TextureImporterType.Sprite;
        importer.spriteImportMode = SpriteImportMode.Single;
        importer.filterMode = FilterMode.Point;
        importer.mipmapEnabled = false;
        importer.textureCompression = TextureImporterCompression.Uncompressed;
        importer.alphaIsTransparency = true;
        importer.SaveAndReimport();
        var tex = AssetDatabase.LoadAssetAtPath<Texture2D>(assetPath);
        importer.spritePixelsPerUnit = Mathf.Max(1, tex.width);
        importer.SaveAndReimport();
    }

    static Sprite[] Sprites(string assetPath)
    {
        return AssetDatabase.LoadAllAssetsAtPath(assetPath)
            .OfType<Sprite>()
            .OrderBy(s => s.name, System.StringComparer.Ordinal)
            .ToArray();
    }

    static AnimationClip MakeClip(string path, Sprite[] frames, float fps)
    {
        if (AssetDatabase.LoadAssetAtPath<AnimationClip>(path) != null)
            AssetDatabase.DeleteAsset(path);
        var clip = new AnimationClip { frameRate = fps };
        var binding = new EditorCurveBinding
        {
            type = typeof(SpriteRenderer),
            path = "",
            propertyName = "m_Sprite"
        };
        var keys = new ObjectReferenceKeyframe[frames.Length];
        for (int i = 0; i < frames.Length; i++)
            keys[i] = new ObjectReferenceKeyframe { time = i / fps, value = frames[i] };
        AnimationUtility.SetObjectReferenceCurve(clip, binding, keys);
        var settings = AnimationUtility.GetAnimationClipSettings(clip);
        settings.loopTime = true;
        AnimationUtility.SetAnimationClipSettings(clip, settings);
        AssetDatabase.CreateAsset(clip, path);
        return clip;
    }

    static AnimatorController MakeController(AnimationClip idleClip, AnimationClip walkClip)
    {
        const string path = "Assets/Art/Hero.controller";
        if (AssetDatabase.LoadAssetAtPath<AnimatorController>(path) != null)
            AssetDatabase.DeleteAsset(path);
        var ctrl = AnimatorController.CreateAnimatorControllerAtPath(path);
        ctrl.AddParameter("Moving", AnimatorControllerParameterType.Bool);
        var sm = ctrl.layers[0].stateMachine;
        var idle = sm.AddState("Idle");
        idle.motion = idleClip;
        var walk = sm.AddState("Walk");
        walk.motion = walkClip;
        sm.defaultState = idle;
        var toWalk = idle.AddTransition(walk);
        toWalk.AddCondition(AnimatorConditionMode.If, 0, "Moving");
        toWalk.hasExitTime = false;
        toWalk.duration = 0f;
        var toIdle = walk.AddTransition(idle);
        toIdle.AddCondition(AnimatorConditionMode.IfNot, 0, "Moving");
        toIdle.hasExitTime = false;
        toIdle.duration = 0f;
        return ctrl;
    }

    static void BuildTiles()
    {
        var floorTile = MakeTile("Assets/Art/floor.asset", "Assets/Art/Imported/floor.jpg");
        var wallTile = MakeTile("Assets/Art/wall.asset", "Assets/Art/Imported/wall.jpg");
        var gridGo = new GameObject("Grid");
        var grid = gridGo.AddComponent<Grid>();
        grid.cellSize = Vector3.one;

        var floorGo = new GameObject("Floor");
        floorGo.transform.SetParent(gridGo.transform, false);
        var floorMap = floorGo.AddComponent<Tilemap>();
        floorGo.AddComponent<TilemapRenderer>();

        var wallGo = new GameObject("Walls");
        wallGo.transform.SetParent(gridGo.transform, false);
        var wallMap = wallGo.AddComponent<Tilemap>();
        var wallRenderer = wallGo.AddComponent<TilemapRenderer>();
        wallRenderer.sortingOrder = 1;
        wallGo.AddComponent<TilemapCollider2D>();

        for (int y = 0; y < Rows; y++)
        {
            for (int x = 0; x < Cols; x++)
            {
                bool edge = x == 0 || y == 0 || x == Cols - 1 || y == Rows - 1;
                if (edge) wallMap.SetTile(new Vector3Int(x, y, 0), wallTile);
                else floorMap.SetTile(new Vector3Int(x, y, 0), floorTile);
            }
        }
    }

    static Tile MakeTile(string assetPath, string spritePath)
    {
        if (AssetDatabase.LoadAssetAtPath<Tile>(assetPath) != null)
            AssetDatabase.DeleteAsset(assetPath);
        var tile = ScriptableObject.CreateInstance<Tile>();
        tile.sprite = AssetDatabase.LoadAssetAtPath<Sprite>(spritePath);
        AssetDatabase.CreateAsset(tile, assetPath);
        return tile;
    }

    static Vector3 FitHeight(Sprite sprite, float units)
    {
        if (sprite == null) return Vector3.one;
        float h = sprite.rect.height / sprite.pixelsPerUnit;
        if (h < 0.01f) return Vector3.one;
        float s = units / h;
        return new Vector3(s, s, 1f);
    }
}
