
# movearound

  Move elements in multiple containers.

  ![Screen cast]()

## Installation

  Install with [component(1)](http://component.io):

    $ component install chemzqm/movearound

## API

#### Connector(el, className)

Initialize Movearound with every containers has class `className` in node `el`.


#### bind()

Initialize or rebind all the drag and drop events.

Every node as the direct children of every container would become moveable around all the containers.

This method **should** be called every time there's container or draggable element added/removed.

#### unbind()

Unbind all the D&D events.

Inspired by <https://github.com/yields/sortable>

## License

  MIT
