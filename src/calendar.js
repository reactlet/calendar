// Calendar component
var Calendar = React.createClass({
    name: 'calendar',
    mixins: [getCommonMixin],
    
    // attribute definitions
    getAttributes: function() {
        var attributes = [
            { name:'boxClass', type:'string', required:false, defaultValue:'', note:'container CSS class' },
            { name:'type', type:'string', required:false, defaultValue:'month', note:'calendar ' },
            { name:'year', type:'number', required:false, defaultValue:2015, note:'calendar year' },
            { name:'month', type:'number', required:false, defaultValue:1, note:'calendar month' },
            { name:'activeMonthOnly', type:'boolean', required:false, defaultValue:false, note:'show active month only' }
        ];
        return attributes;
    },
    
    /*
    getInitialState: function() {
        return {
            year: this.props.year,
            month: this.props.month,
            activeMonthOnly: this.props.activeMonthOnly,
            type: 'month'
        };
    },
    */
    
    render: function() {
        var calendar = 'unknown calendar type';
        if (this.state.type === 'month') {
            calendar =
                <CalendarMonth
                    year = { this.state.year }
                    month = { this.state.month }
                    activeMonthOnly={ this.state.activeMonthOnly }
                />;
        }
        return (
            <div>{ calendar }</div>
        );
    }
});

// Calendar Month Component
var CalendarMonth = React.createClass({
    
    getInitialState: function() {
        return {
            year: this.props.year,
            month: this.props.month,
            eventsCollection: null,
            activeMonthOnly: this.props.activeMonthOnly
        };
    },
    
    render: function() {
        var dayHeaders = [
            { name:'Sun' },
            { name:'Mon' },
            { name:'Tue' },
            { name:'Wed' },
            { name:'Thu' },
            { name:'Fri' },
            { name:'Sat' }
        ];
        var days =[];
        
        var monthFirstDay = moment({ year:this.state.year, month:this.state.month-1, day:1 });
        var monthLastDay = moment(monthFirstDay).add(1, 'month').subtract(1, 'day');
        var weekDayOfFirstDay = moment(monthFirstDay).day();
        var blockFirstDay = moment(monthFirstDay).add( -1 * weekDayOfFirstDay, 'day');
        var weekDayOfLastDay = moment(monthLastDay).day();
        var blockLastDay = moment(monthLastDay).add(6 - weekDayOfLastDay, 'day');
        var calendarCaption = monthFirstDay.format('MMMM YYYY');
        
        var daysCount = blockLastDay.diff(blockFirstDay, 'days');
        for (i = 0; i <= daysCount; i++) {
            var targetDay = moment(blockFirstDay).add(i, 'day');
            // make array element's key unique to avoid reuse of day component in neighboring month
            var arrayKey = ['M', this.state.month, 'D', targetDay.format('YYYY-MM-DD')].join('_');
            var targetDayKey = targetDay.format('YYYY-MM-DD');
            var events = this.state.eventsCollection && this.state.eventsCollection[targetDayKey] || [];
            var isThisMonth = targetDay.month() === this.state.month-1;
            var isToday = targetDayKey === moment().format('YYYY-MM-DD');
            var todayStatus = ''; 
            var dayStatus = '';
            // today status is only set for this month and today
            if (isThisMonth && isToday) {
                todayStatus = 'today';
            }
            // When activeMonthOnly = true, only show dates of active month on calendar
            if (this.state.activeMonthOnly) {
                if (!isThisMonth) {
                    // hide date not in active month
                    dayStatus = 'hide-day';
                }
            }
            days.push({
                name: targetDay.date(),
                key: arrayKey,
                events: events,
                monthStatus:  isThisMonth ? 'active' : 'inactive',
                todayStatus: todayStatus,
                dayStatus: dayStatus
            });
            
        }
        
        var calendarItems = [];
        dayHeaders.map(function(dayHeader) {
            calendarItems.push(<CalendarHeader name={ dayHeader.name } key={ dayHeader.name } />);
        });
        days.map(function(day) {
            calendarItems.push(
                <CalendarDay
                    name={ day.name } key={ day.key } events={ day.events }
                    dayStatus={ day.dayStatus } monthStatus={ day.monthStatus }
                    todayStatus={ day.todayStatus }
                />
            );
        });
        return (
            <div className="calendar-container">
                <div className="calendar-caption">
                    { calendarCaption }
                </div>
                <div>
                    { calendarItems }
                </div>
            </div>
        );
    }
});

// Calendar Header Component
var CalendarHeader = React.createClass({
    render: function() {
        return (
            <div className={ 'calendar-header' } >
                <div>{ this.props.name }</div>
            </div>
        );
    }
});

// Calendar Day Component
var CalendarDay = React.createClass({
    getInitialState: function() {
        return {
            selected: false,
            hover: false,
            dayClassNames: ['calendar-day'],
            dayHeaderClassNames: ['calendar-day-header'],
            dayBodyClassNames: ['calendar-day-body']
        };
    },
    componentWillMount: function() {
        // Invoked once, immediately before the initial rendering occurs
        this.state.dayClassNames.push(this.props.monthStatus, this.props.todayStatus, this.props.dayStatus);
        this.state.dayHeaderClassNames.push(this.props.monthStatus);
    },
    componentDidMount: function() {
        // Invoked immediately after rendering occurs, DOM element is accessed via this.getDOMNode()
    },
    /*
    onClick: function(e) {
        console.log('onClick', e);
    },
    */
    onMouseEnter: function(e) {
        this.state.dayClassNames.push('calendar-day-hover');
        this.forceUpdate();
    },
    onMouseLeave: function(e) {
        var classIndex = this.state.dayClassNames.indexOf('calendar-day-hover');
        if (classIndex >= 0) {
            this.state.dayClassNames.splice(classIndex, 1);
        }
        this.forceUpdate();
    },
    render: function() {
        var events = this.props.events;
        var items = [];
        this.props.events.map(function(event) {
            items.push(<div className={ 'calendar-item ' + event.category }>{ event.title }</div>);
        });
        return (
            <div className={ this.state.dayClassNames.join(' ') }
                onClick={ this.onClick }
                onMouseEnter={ this.onMouseEnter }
                onMouseLeave={ this.onMouseLeave }
                >
                <div className={ this.state.dayHeaderClassNames.join(' ') }>{ this.props.name }</div>
                <div className={ this.state.dayBodyClassNames.join(' ') }>{ items }</div>
            </div>
        );
    }
});

