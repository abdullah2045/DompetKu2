import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

export default function App() {
  // 1. STATE MANAGEMENT saya buat conto
  const [transaksi, setTransaksi] = useState([]);

  const [ket, setKet] = useState("");
  const [nominal, setNominal] = useState("");

  // 2. LOGIKA MENGHITUNG TOTAL SALDO
  const saldoTotal = transaksi.reduce((total, item) => {
    if (item.tipe === "masuk") {
      return total + item.nominal;
    } else {
      return total - item.nominal;
    }
  }, 0);

  // 3. FUNGSI TAMBAH TRANSAKSI
  const tambahData = (tipeTransaksi) => {
    if (ket === "" || nominal === "") {
      Alert.alert("Peringatan", "Deskripsi dan Nominal tidak boleh kosong!");
      return;
    }

    const angkaNominal = parseInt(nominal);
    if (isNaN(angkaNominal) || angkaNominal <= 0) {
      Alert.alert("Peringatan", "Nominal harus berupa angka yang valid!");
      return;
    }

    // LOGIKA TAMBAHAN: Jika ingin melakukan pengeluaran, setelah cek apakah saldo cukup
    if (tipeTransaksi === "keluar" && angkaNominal > saldoTotal) {
      Alert.alert(
        "Transaksi Ditolak",
        "Saldo Anda tidak cukup untuk melakukan pengeluaran ini!",
      );
      return;
    }

    const dataBaru = {
      id: Date.now().toString(),
      ket: ket,
      nominal: angkaNominal,
      tipe: tipeTransaksi,
    };

    setTransaksi([...transaksi, dataBaru]);
    setKet("");
    setNominal("");
  };

  // 4. FUNGSI HAPUS TRANSAKSI
  const hapusTransaksi = (idDihapus) => {
    const sisaTransaksi = transaksi.filter((item) => item.id !== idDihapus);
    setTransaksi(sisaTransaksi);
  };

  // 5. RENDER ITEM UNTUK FLATLIST
  const renderItem = ({ item }) => {
    return (
      <View style={styles.cardList}>
        <View>
          <Text style={styles.textKet}>{item.ket}</Text>
          <Text
            style={[
              styles.textNominal,
              item.tipe === "masuk" ? styles.teksHijau : styles.teksMerah,
            ]}
          >
            {item.tipe === "masuk" ? "+" : "-"} Rp{" "}
            {item.nominal.toLocaleString("id-ID")}
          </Text>
        </View>

        {/* Tombol Hapus di sebelah kanan riwayat */}
        <TouchableOpacity
          style={styles.tombolHapus}
          onPress={() => hapusTransaksi(item.id)}
        >
          <Text style={styles.teksTombolHapus}>Hapus</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* --- HEADER SALDO --- */}
      <View style={styles.header}>
        <Text style={styles.judulHeader}>Total Saldo Anda</Text>
        <Text style={styles.saldoAngka}>
          Rp {saldoTotal.toLocaleString("id-ID")}
        </Text>
      </View>

      {/* --- FORM INPUT --- */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.inputBox}
          placeholder="Deskripsi Transaksi"
          value={ket}
          onChangeText={(text) => setKet(text)}
        />
        <TextInput
          style={styles.inputBox}
          placeholder="Nominal"
          value={nominal}
          onChangeText={(text) => setNominal(text)}
          keyboardType="numeric"
        />

        <View style={styles.rowTombol}>
          <TouchableOpacity
            style={[styles.tombol, styles.tombolMasuk]}
            onPress={() => tambahData("masuk")}
          >
            <Text style={styles.teksTombol}>Pemasukan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tombol, styles.tombolKeluar]}
            onPress={() => tambahData("keluar")}
          >
            <Text style={styles.teksTombol}>Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- LIST HISTORY --- */}
      <View style={styles.listContainer}>
        <Text style={styles.judulList}>Riwayat Transaksi</Text>

        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.teksKosong}>
              Belum ada riwayat transaksi, Bro!
            </Text>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

// STYLING
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#3498DB",
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  judulHeader: {
    fontSize: 16,
    color: "#EAF2F8",
    marginBottom: 5,
  },
  saldoAngka: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E8E8",
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#D5DBDB",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  rowTombol: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tombol: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  tombolMasuk: {
    backgroundColor: "#2ECC71",
  },
  tombolKeluar: {
    backgroundColor: "#E74C3C",
  },
  teksTombol: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  judulList: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 10,
  },
  cardList: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Biar teks riwayat dan tombol hapus sejajar vertikal
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E8E8",
  },
  textKet: {
    fontSize: 16,
    color: "#34495E",
    fontWeight: "500",
  },
  textNominal: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },
  teksHijau: {
    color: "#27AE60",
  },
  teksMerah: {
    color: "#C0392B",
  },
  tombolHapus: {
    backgroundColor: "#FDEDEC", // Merah sangat muda untuk tombol hapus elegan
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FADBD8",
  },
  teksTombolHapus: {
    color: "#E74C3C",
    fontSize: 13,
    fontWeight: "bold",
  },
  teksKosong: {
    textAlign: "center",
    marginTop: 20,
    color: "#95A5A6",
    fontStyle: "italic",
  },
});
