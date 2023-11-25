import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                    title: 'Tab One',
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name="info-circle"
                                        size={25}
                                        color={Colors[colorScheme ?? 'light'].text}
                                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />
            <Tabs.Screen
                name="two"
                options={{
                    href: null,

                    title: 'Tab Three',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="three"
                options={{
                    href: null,

                    title: 'Tab Three',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
            

{/* These on top are hidden from navbar, saved to be as reference for something for now.  */}



            
            <Tabs.Screen
                name="t1"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
                }}
            />
            <Tabs.Screen
                name="t2"
                options={{
                    title: 'Add a trip',
                    tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
                }}
            />
            <Tabs.Screen
                name="t3"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
                }}
            />
            <Tabs.Screen
                name="t4"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color }) => <TabBarIcon name="history" color={color} />,
                }}
            />
            <Tabs.Screen
                name="t5"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
        </Tabs>
    );
}
