import { Text, View, StyleSheet } from "react-native"
import { globalStyles } from "../styles/globalStyles"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import { colors } from "../constants/colors"

export default function DatePicker({ form, setForm }) {
  const dateValue = form.date instanceof Date ? form.date : new Date(form.date)

  return (
    <View style={styles.container}>
      <Text style={globalStyles.inputLabel}>Data</Text>
      <View style={styles.pickerWrapper}>
        <RNDateTimePicker
          mode="date"
          display="compact"
          value={dateValue}
          onChange={(_, d) => {
            if (d) setForm({ ...form, date: d })
          }}
          accentColor={colors.primary}
          themeVariant="light"
          style={styles.picker}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
  },
  pickerWrapper: {
    marginTop: 4,
    zIndex: 999,
  },
  picker: {
    alignSelf: "flex-start",
  },
})
