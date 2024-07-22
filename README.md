# GeoGlyph
A collection of all kinds of little projects.

## [Graphs](src/IDE/pages/DisplayGraph.tsx)
Inspired to give this a try after reading about the (cyclic) dungeon generation setup used for Unexplored in [this article by Boris the Brave](https://www.boristhebrave.com/2021/04/10/dungeon-generation-in-unexplored/)

### Ideas
- Graph Grammar ([Example](https://github.com/ihh/graphgram))
- Cyclic Dungeon Generation ([Example](https://www.reddit.com/r/roguelikedev/comments/193q75x/cyclic_dungeon_generator_prototypeproofofconcept/))

### Libraries
  - [Graphology](https://graphology.github.io/)
  - [Sigma.js](https://www.sigmajs.org/)
  - [React-Sigma](https://sim51.github.io/react-sigma/)

## [Background patterns](src/IDE/components/BackgroundPattern.tsx)
Spend some time creating a react component that could render an infinite background based on some patterns most editors use.

## [Node based logic](src/IDE/pages/DisplayReactFlow.tsx)
A tangent from graphs after encountering [Machinations](https://machinations.io/docs/loot-craft) during my research for cyclic dungeon generation. (Creator of Unexplored is co-founder of Machinations)

### Ideas
- Code-less idle/incremental game creation
- Behaviour-graph engine ([Example](https://github.com/Oneirocom/behave-graph))

### Libraries
- [React Flow](https://reactflow.dev/)

## [Procedural Animation](src/IDE/pages/DisplayProceduralAnimation.tsx)
Got mesmerized by [the beautiful video by Argonaut](https://www.youtube.com/watch?v=qlfh_rv6khY), so I had to give it a try.

### Libraries
- [Excalibur](https://excaliburjs.com/)

## [(Directional) Field of View with Fog of war](src/IDE/pages/Magitek/DisplayFieldOfView.tsx)
Woke up with a way to implement this, having failed at implementing it multiple times using Excalibur.

### Ideas
- Expand it by adding wall tracking ([Mandatory link to Red Blob Games](https://www.redblobgames.com/articles/visibility/))
- Try creating a squad based horror game
  - Some sources of inspiration:
    - [Survivor Squad](https://store.steampowered.com/app/258050/Survivor_Squad/)
    - [Mech Engineer](https://store.steampowered.com/app/1428520/Mech_Engineer/0)
    - [Templar Battleforce](https://store.steampowered.com/app/370020/Templar_Battleforce/)
    - [BattleTech](https://store.steampowered.com/app/637090/BATTLETECH/)
    - [Darkwood](https://store.steampowered.com/app/274520/Darkwood/)
- Start out simple with a shooter?

### Libraries
- [Excalibur](https://excaliburjs.com/)