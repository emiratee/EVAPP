jest.mock('expo-router', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
    Link: jest.fn()
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
    useFocusEffect: jest.fn(),
}));
