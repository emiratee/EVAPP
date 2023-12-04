import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation } from 'expo-router';


function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

    const leftHeader = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{marginLeft:20}}>
                <FontAwesome name="chevron-left" size={24} color="black" /> 
            </Text>
        </TouchableOpacity>
    )
    const navigation = useNavigation();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#393939",
            }}>
            <Tabs.Screen
                name="TripCardRedirect"
                options={{
                    href: null,
                    title: 'Search results',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="addCredits"
                options={{
                    href: null,
                    title: 'Add Credits',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                    headerLeft: leftHeader
                }}

            />

            <Tabs.Screen
                name="map"
                options={{
                    href: null,
                    title: 'map',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="login"
                options={{
                    href: null,
                    title: 'Login',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="register"
                options={{
                    href: null,
                    title: 'Register',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
                }}
            />
            <Tabs.Screen
                name="addTrip"
                options={{
                    title: 'Add a trip',
                    tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                   
                }}
            />
        </Tabs>
    );
}
