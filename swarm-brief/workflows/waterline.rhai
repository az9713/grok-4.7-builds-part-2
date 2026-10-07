let meta = #{
    name: "waterline",
    description: "Research why ships rust at the waterline; emit a locked-figure explainer",
    phases: [ #{ title: "Research" }, #{ title: "Figures" }, #{ title: "Compose" } ],
};

let item = #{
    "type": "object",
    "required": ["ok", "note"],
    "properties": #{
        "ok": #{ "type": "boolean" },
        "note": #{ "type": "string" },
        "path": #{ "type": "string" },
    },
};

phase("Research");
let topics = ["oxygen-cell", "splash-zone", "mill-scale", "paint-holiday"];
let jobs = [];
for t in topics {
    jobs.push(#{
        prompt: "Answer the frozen question for " + t + " in one paragraph. No new claims beyond corrosion at the waterline. Report {ok, note}.",
        label: "r-" + t,
        capability_mode: "read-only",
        output_schema: item,
    });
}
let research = parallel(jobs);

phase("Figures");
let figs = parallel([
    #{
        prompt: "Verify explainer/art/hull-plate.jpg is the copperplate hull lock. {ok, note, path}.",
        label: "fig-hull",
        capability_mode: "read-only",
        output_schema: item,
    },
    #{
        prompt: "Reject any figure that introduces letters in the bitmap. Labels belong in SVG. {ok, note}.",
        label: "fig-no-text",
        capability_mode: "read-only",
        output_schema: item,
    },
]);

phase("Compose");
let compose = agent(#{
    prompt: "Compose explainer/index.html from the research notes. Keep hull-plate.jpg. Do not invent a second hull.",
    label: "compose",
    capability_mode: "read-write",
    output_schema: item,
});

complete(#{
    summary: "waterline brief",
    research: research,
    figures: figs,
    compose: compose,
});
