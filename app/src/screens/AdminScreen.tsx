import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { FC } from "react";
import { useTheme } from "../context/ThemeContext"
import { BarChart, Package, Users, TrendingUp, Truck } from "lucide-react-native"
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the path as necessary
import { useNavigation } from "@react-navigation/native";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Admin'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}


const AdminScreen = (props: Props): React.JSX.Element => {
  const navigation = useNavigation();
  const {theme} = useTheme()
  const colors = theme.colors

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryBlue }]}>Admin Dashboard</Text>

      <View style={styles.statsContainer}>
        <View style={[styles.statItem, { backgroundColor: colors.lightBlue }]}>
          <TrendingUp color={colors.primaryBlue} size={24} />
          <Text style={[styles.statValue, { color: colors.darkText }]}>$12,345</Text>
          <Text style={[styles.statLabel, { color: colors.lightText }]}>Total Sales</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: colors.lightBlue }]}>
          <Package color={colors.primaryBlue} size={24} />
          <Text style={[styles.statValue, { color: colors.darkText }]}>1,234</Text>
          <Text style={[styles.statLabel, { color: colors.lightText }]}>Products Sold</Text>
        </View>
        <View style={[styles.statItem, { backgroundColor: colors.lightBlue }]}>
          <Users color={colors.primaryBlue} size={24} />
          <Text style={[styles.statValue, { color: colors.darkText }]}>567</Text>
          <Text style={[styles.statLabel, { color: colors.lightText }]}>Active Customers</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Sales Overview</Text>
        <BarChart color={colors.primaryBlue} size={200} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Recent Orders</Text>
        {/* Add a list or table of recent orders here */}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Inventory Management</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primaryBlue }]}>
          <Package color={colors.white} size={20} style={styles.buttonIcon} />
          <Text style={[styles.buttonText, { color: colors.white }]}>Manage Inventory</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Delivery Management</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primaryBlue }]}>
          <Truck color={colors.white} size={20} style={styles.buttonIcon} />
          <Text style={[styles.buttonText, { color: colors.white }]}>Manage Deliveries</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Create Product</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Create" as never)}
        style={[styles.button, { backgroundColor: colors.primaryBlue }]}
      >
        <Text style={[styles.buttonText, { color: colors.white }]}>Crear Producto</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AdminScreen

