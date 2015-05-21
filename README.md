Reactlet Calendar
=================

Calendar component

![Table example](res/reactlet-calendar-demo.png)

![Table events example](res/reactlet-calendar-events-demo.png)

Example code:
-------------
```
app.componentData = {
    year: 2014,
    month:9
};
app.component = React.render(
    <Calendar data={ app.componentData } />,
    document.getElementById('component1')
);
```
