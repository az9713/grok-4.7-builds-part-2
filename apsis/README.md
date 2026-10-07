# Apsis

One craft on a plotted orbit. Prograde raises the far point. A second prograde burn, made at that far point, rounds the path onto the green line.

The step is RK4 with GM = 1. The inner circle has radius 1. The green line has radius 1.85. Fuel is 0.48. Thrust is 0.12. A coasting ellipse wins when eccentricity is under 0.08 and the semi-major axis is within 0.08 of 1.85, held for 1.2 seconds.

Open `play/index.html`.

Built with Grok Build. MIT.
