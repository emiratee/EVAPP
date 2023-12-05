import React from 'react';
import * as icons from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { TouchableOpacity, Text, Image } from 'react-native';
import { useChat } from '../../utils/chat';



function TabBarIcon(props: {
    name: React.ComponentProps<typeof icons.FontAwesome>['name'];
    color: string;
}) {
    return <icons.FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const { name, imageUrl } = useChat();
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
                    // headerLeft: leftHeader
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
                name="chatView"
                options={{
                    headerTitle: name,
                    href: null,
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                    headerLeft: () => (
                        <Link href="/messages" asChild>
                            <TouchableOpacity >
                                <Text style={{ paddingLeft: 20, fontSize: 16, color: '#8757f7' }}>Back</Text>
                            </TouchableOpacity>
                        </Link>
                    ),
                    headerRight: () => (
                        imageUrl ? (
                            <Image source={{ uri: imageUrl }} style={{ marginRight: 20, height: 40, width: 40, borderWidth: 1, borderRadius: 50, borderColor: '#000' }} />
                        ) : (
                            <icons.AntDesign name="user" size={40} color="black" style={{ marginRight: 20 }} />
                        )
                    )

                }}
            />
            {/* height: 50,
        width: 50,
        padding: 8,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: '#000', */}



            {/* These on top are hidden from navbar, saved to be as reference for something for now.  */}




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
                    headerTitle: 'Inbox',
                    tabBarLabel: 'Messages',
                    tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
                    headerRight: () => (
                        <Link href="/messages" asChild>
                            {/* Select button on the right*/}
                            <TouchableOpacity >
                                <Text style={{ paddingRight: 30, fontSize: 16, color: '#8757f7' }}>Select</Text>
                            </TouchableOpacity>
                        </Link>
                    ),
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
