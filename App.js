import React, { Component } from 'react';
import { View,ScrollView,Text,StatusBar } from 'react-native';
import UTMLatLng from 'utm-latlng';
import moment from 'moment';

class App extends Component 
{
    static id= 1;
    constructor()
    {
        super();
        this.state = {
            ready: false,
            locations: [],
            error: null
        };
        this.coordConverter = new UTMLatLng("WGS 84");
    }

    setPosition = position =>
    {
        // converting latlong to easting northing
        const utmCoordinate = this.coordConverter.convertLatLngToUtm( position.coords.latitude,position.coords.longitude,3 );

        // adding easting, northing to position properties and assigning it to location
        const location = {
            ...position,
            easting: utmCoordinate.Easting,
            northing: utmCoordinate.Northing,
            id: App.id++
        }
        
        this.setState(prevState => 
        {
            let locations = [ location, ...prevState.locations]
            if ( locations.length > 20 )
            {
                locations.pop();
            }
            return { ready: true, locations }
        });
    }
        
    componentDidMount()
    {
        setInterval( () => navigator.geolocation.getCurrentPosition( this.setPosition  ), 5000);
        // navigator.geolocation.watchPosition( this.setPosition  );
    }
    createLocationCard = (location,i) =>
    {
        const { latitude,longitude,accuracy,speed,direction } = location.coords;
        const { id,timestamp,easting,northing } = location;
        
        return (
            <View key={i} style={{ margin: 10, padding: 10, backgroundColor: "rgba(255,0,0,0.5)", borderColor: 'lightgrey', borderWidth: 0.5}}> 
                <Text>Id: { id }</Text> 
                <Text>Latitude: { latitude }</Text> 
                <Text>Longitude: { longitude }</Text>
                <Text>Easting: {easting}</Text>
                <Text>Northing: {northing}</Text>
                <Text>Accuracy: { accuracy }</Text>
                <Text>Speed: { speed }</Text>
                <Text>Bearing: { direction }</Text>
                <Text>Time: { moment( timestamp ).format('MMMM Do YYYY, h:mm:ss a') }</Text>
                <Text>Time: { moment( timestamp ).fromNow() }</Text>
            </View>
        );
    }
    render()
    {
        return (
            <ScrollView>
                <StatusBar barStyle="light-content" />
                <Text style={{textAlign: 'center', fontSize: 30}}>Coordinates:</Text>
                { 
                    this.state.ready && 
                    this.state.locations.map( this.createLocationCard )
                }
            </ScrollView>
        );
    }
}

export default App;