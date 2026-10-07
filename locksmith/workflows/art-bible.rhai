let meta = #{
    name: "art-bible",
    description: "Generate and verify Service Door art bible",
    phases: [ #{ title: "Generate" }, #{ title: "Verify" } ],
};

let item_schema = #{
    "type": "object",
    "required": ["path", "ok"],
    "properties": #{
        "path": #{ "type": "string" },
        "ok": #{ "type": "boolean" },
        "note": #{ "type": "string" },
    },
};

phase("Generate");
let jobs = [];
let names = ["hero", "guard", "floor", "wall", "elevator"];
for n in names {
    jobs.push(#{
        prompt: "Read existing Imagine locks under _shared/locks for " + n + ". Do not invent files. Report {path, ok, note}.",
        label: "gen-" + n,
        capability_mode: "read-only",
        output_schema: item_schema,
    });
}
let results = parallel(jobs);

phase("Verify");
let vjobs = [];
let i = 0;
for r in results {
    let path = "unknown";
    if r != () && r.success && r.output.path != () { path = r.output.path; }
    vjobs.push(#{
        prompt: "Adversarially verify identity lock for " + path + ". Set ok=true only with evidence you read from disk.",
        label: "verify-" + i.to_string(),
        capability_mode: "read-only",
        output_schema: item_schema,
    });
    i += 1;
}
let verdicts = parallel(vjobs);

let confirmed = [];
let j = 0;
for v in verdicts {
    if v != () && v.success && v.output.ok == true { confirmed.push(v.output); }
    j += 1;
}
complete(#{ summary: confirmed.len().to_string() + " locks verified", confirmed: confirmed });
