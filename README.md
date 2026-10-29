# El Pollo Loco

A 2D jump-and-run browser game built with plain JavaScript and the HTML5 Canvas.
Run through the desert, collect coins and bottles, dodge the chickens and defeat the giant end boss.

## How to Play

1. Open `index.Html` in a modern browser (or use a local server such as VS Code Live Server).
2. Click, tap or press any key to start – background music starts with your first input.

| Key        | Action          |
| ---------- | --------------- |
| ← / →      | Move left/right |
| ↑          | Jump            |
| Space      | Throw a bottle  |

On mobile devices, on-screen touch controls are shown. Play in landscape mode.

## Project Structure

- `script/model/` – game classes (character, enemies, end boss, status bars, level)
- `script/logic/` – keyboard state
- `levels/`, `assets/`, `style/` – level data, images/sounds and styles
