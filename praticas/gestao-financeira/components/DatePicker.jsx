import { Text, View, StyleSheet } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { colors } from "../constants/colors"

export default function DatePicker({ form, setForm }) {
  const dateValue = form.date instanceof Date ? form.date : new Date(form.date)

  return (
    <View>
      <Text style={globalStyles.inputLabel}>Data</Text>
      <RNDateTimePicker
        mode="date"
        display="compact"
        value={dateValue}
        onChange={(_, d) => {
          if (d) setForm({ ...form, date: d })
        }}
        accentColor={colors.primary}
        style={styles.picker}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  picker: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
})