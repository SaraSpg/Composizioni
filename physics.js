let engine, world, render;

function initPhysics() {
  engine = Matter.Engine.create();
  world = engine.world;

  render = Matter.Render.create({
    element: document.body,
    canvas: document.getElementById("canvas"),
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: "transparent"
    }
  });

  Matter.Render.run(render);
  Matter.Runner.run(Matter.Runner.create(), engine);
}

function dropBlocks() {
  for (let i = 0; i < 20; i++) {
    const box = Matter.Bodies.rectangle(
      Math.random() * window.innerWidth,
      -50,
      20 + Math.random() * 40,
      20 + Math.random() * 40,
      {
        render: {
          fillStyle: `hsl(${Math.random()*360}, 70%, 60%)`
        }
      }
    );
    Matter.World.add(world, box);
  }
}
