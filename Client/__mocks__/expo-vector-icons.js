jest.mock('@expo/vector-icons', () => ({

    
    Ionicons: (props) => <View {...props} />, // Mock Ionicons
    FontAwesome: (props) => <View {...props} />, // Mock FontAwesome
  
}))



// const MockedIcons = {
//     Ionicons: (props) => <View {...props} />, // Mock Ionicons
//     FontAwesome: (props) => <View {...props} />, // Mock FontAwesome
//     // Add more mocked icons as needed
// };

