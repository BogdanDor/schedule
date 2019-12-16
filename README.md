# Schedule

Schedule is mini-clone React with mininum functional.
It is study project and it isn't its substitue.
It support render, virtual dom, setState, events.
**Every** setState call rerender.

## Linking

Before use Schedule you need make link project.
Move to Schedule root and run `npm link`.
After in project run `link schedule`.

## Examples

Repository has two example projects "hello-world" and "todo".

## How to run hello-world

1. your current directory must be Schedule.
2. `npx babel src --out-dir dist --presets react-app/prod`
3. `npm link`
4. `cd fixtures/hello-world`
5. `npm link schedule`
6. `npx babel src --out-dir dist --presets react-app/prod`
7. `npx serve`
8. open localhost:5000 in your browser

## Development

Build
  
`npx babel src --out-dir dist --presets react-app/prod`

Run tests

  `npm test`
