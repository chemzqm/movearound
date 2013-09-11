
# movearound

  Move elements in multiple containers. The element for dragging could be added dynamicly and also the container could be added dynamicly.

  ![Screen cast](http://chemzqm.github.io/movearound/screencast.png)

  [Demo](http://chemzqm.github.io/movearound/index.html)

## Installation

  Install with [component(1)](http://component.io):

    $ component install chemzqm/movearound

## API

#### Connector(el, className , [handler])

Initialize Movearound with every containers has class `className` in node `el`.

If the `handler` is set to true, elmenet has className `handler` would be used for dragging.

### bind()

Initialize or rebind all the drag and drop events.

Every node as the direct children of every container would become moveable around all the containers.

This method **should** be called every time there's container or draggable element added/removed.

### unbind()

Unbind all the D&D events.

### remove()

unbind the events and remove the event listeners.

Inspired by <https://github.com/yields/sortable>

## License

  MIT
