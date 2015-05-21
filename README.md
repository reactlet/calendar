Reactlet Calendar
=================

Calendar component

![Table events example](res/reactlet-calendar-events-demo.png)

Example code:
-------------
```
app.componentData = {
    year: 2014,
    month: 9,
    eventsCollection: {
        '2015-05-01': [
            { category:'home', title:'gas bill' },
            { category:'work', title:'report due' }
        ],
        '2015-05-11': [
            { category:'home', title:'test' }
        ]
    }
};
app.component = React.render(
    <Calendar data={ app.componentData } />,
    document.getElementById('component1')
);
```
