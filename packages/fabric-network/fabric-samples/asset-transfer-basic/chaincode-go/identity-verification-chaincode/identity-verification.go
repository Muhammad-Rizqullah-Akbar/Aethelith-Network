package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// ========= Struct untuk data identitas user =========
// Ini adalah struktur data utama yang akan disimpan di private collection.
type Identity struct {
	ID             string                  `json:"id"`             // ID unik user (UID)
	FullName       string                  `json:"fullName"`       // Nama lengkap
	NIK            string                  `json:"nik"`            // Nomor Induk Kependudukan
	BirthPlace     string                  `json:"birthPlace"`     // Tempat lahir
	BirthDate      string                  `json:"birthDate"`      // Tanggal lahir
	Address        string                  `json:"address"`        // Alamat
	Email          string                  `json:"email"`          // Alamat email
	VerificationVC map[string]VerificationVC `json:"verificationVC"` // Map untuk status VC dari berbagai jenis verifikasi
}

// ========= Struct untuk Verifiable Credential (VC) =========
// Ini adalah struktur data untuk setiap jenis VC, misal "kependudukan".
type VerificationVC struct {
	Status   string `json:"status"`   // "pending" | "verified" | "rejected"
	IssuedBy string `json:"issuedBy"` // MSP ID dari validator yang menerbitkan VC
	IssuedAt string `json:"issuedAt"` // Timestamp kapan VC diterbitkan
	DataHash string `json:"dataHash"` // Hash dari data yang diverifikasi (untuk ZKP di masa depan)
}

// ========= Smart Contract struct =========
type SmartContract struct {
	contractapi.Contract
}

// InitLedger is a function required by the Fabric contract-api.
// It can be used to initialize the ledger with some dummy data.
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// Not initializing any data for this version, but function must exist.
	return nil
}

// ========== 1. Fungsi untuk mendaftarkan identitas awal (oleh user) ==========
// Fungsi ini dipanggil saat user pertama kali mendaftar.
// Data identitas awal disimpan ke dalam private collection.
func (s *SmartContract) RegisterIdentity(ctx contractapi.TransactionContextInterface, id string, fullName string, email string, nik string, birthPlace string, birthDate string, address string) error {
	// Cek apakah user sudah terdaftar
	identityJSON, err := ctx.GetStub().GetPrivateData("collectionUserIdentities", id)
	if err != nil {
		return fmt.Errorf("gagal membaca data dari private collection: %v", err)
	}
	if identityJSON != nil {
		return fmt.Errorf("user dengan ID '%s' sudah terdaftar", id)
	}

	identity := Identity{
		ID:             id,
		FullName:       fullName,
		Email:          email,
		NIK:            nik,
		BirthPlace:     birthPlace,
		BirthDate:      birthDate,
		Address:        address,
		VerificationVC: make(map[string]VerificationVC), // Inisialisasi map kosong
	}

	identityJSON, err = json.Marshal(identity)
	if err != nil {
		return fmt.Errorf("gagal marshal identitas ke JSON: %v", err)
	}

	// Simpan data identitas ke private collection
	// Key-nya adalah ID user (UID)
	return ctx.GetStub().PutPrivateData("collectionUserIdentities", id, identityJSON)
}

// ========== 2. Fungsi untuk mengajukan verifikasi (oleh user) ==========
// Fungsi ini dipanggil saat user ingin mengirim data tertentu untuk diverifikasi.
// Fungsi ini TIDAK MENYIMPAN DATA ke blockchain, tapi hanya mencatat status "pending"
// untuk jenis verifikasi yang diajukan.
func (s *SmartContract) RequestVerification(ctx contractapi.TransactionContextInterface, id string, vcType string) error {
	// Ambil MSP ID dari user yang memanggil fungsi
	userMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("gagal mendapatkan MSP ID pemanggil: %v", err)
	}
	// Pastikan hanya user dari OrgUserMSP yang bisa memanggil fungsi ini
	if userMSPID != "Org1MSP" {
    	return fmt.Errorf("hanya user yang bisa mengajukan verifikasi")
	}

	// Ambil data identitas user
	identityJSON, err := ctx.GetStub().GetPrivateData("collectionUserIdentities", id)
	if err != nil {
		return fmt.Errorf("gagal membaca data dari private collection: %v", err)
	}
	if identityJSON == nil {
		return fmt.Errorf("user dengan ID '%s' tidak ditemukan", id)
	}

	var identity Identity
	err = json.Unmarshal(identityJSON, &identity)
	if err != nil {
		return fmt.Errorf("gagal unmarshal JSON: %v", err)
	}

	// Update status verifikasi menjadi "pending"
	identity.VerificationVC[vcType] = VerificationVC{
		Status: "pending",
	}

	updatedJSON, err := json.Marshal(identity)
	if err != nil {
		return fmt.Errorf("gagal marshal identitas yang diperbarui: %v", err)
	}

	return ctx.GetStub().PutPrivateData("collectionUserIdentities", id, updatedJSON)
}

// ========== 3. Fungsi untuk verifikasi identitas (oleh validator) ==========
// Fungsi ini dipanggil oleh validator setelah memverifikasi data off-chain.
// Fungsi ini mengupdate status verifikasi menjadi "verified" di blockchain.
func (s *SmartContract) ValidateIdentity(ctx contractapi.TransactionContextInterface, id string, vcType string, dataHash string) error {
	// Ambil MSP ID dari validator yang memanggil fungsi
	validatorMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("gagal mendapatkan MSP ID pemanggil: %v", err)
	}
	// Pastikan hanya user dari OrgValidatorMSP yang bisa memanggil fungsi ini
	if validatorMSPID != "Org2MSP" {
    	return fmt.Errorf("hanya validator yang bisa memverifikasi identitas")
	}

	// Ambil data identitas user
	identityJSON, err := ctx.GetStub().GetPrivateData("collectionUserIdentities", id)
	if err != nil {
		return fmt.Errorf("gagal membaca data dari private collection: %v", err)
	}
	if identityJSON == nil {
		return fmt.Errorf("user dengan ID '%s' tidak ditemukan", id)
	}

	var identity Identity
	err = json.Unmarshal(identityJSON, &identity)
	if err != nil {
		return fmt.Errorf("gagal unmarshal JSON: %v", err)
	}

	// Pastikan jenis verifikasi yang diajukan ada di map
	if _, exists := identity.VerificationVC[vcType]; !exists {
		return fmt.Errorf("jenis verifikasi '%s' belum diajukan oleh user", vcType)
	}

	// FIX: Correctly handle the two return values from GetTxTimestamp()
	timestamp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return fmt.Errorf("failed to get transaction timestamp: %v", err)
	}
	issuedAt := time.Unix(timestamp.GetSeconds(), int64(timestamp.GetNanos())).String()

	// Update status VC
	identity.VerificationVC[vcType] = VerificationVC{
		Status:   "verified",
		IssuedBy: validatorMSPID,
		IssuedAt: issuedAt,
		DataHash: dataHash, // Hash dari data yang diverifikasi (untuk ZKP)
	}

	updatedJSON, err := json.Marshal(identity)
	if err != nil {
		return fmt.Errorf("gagal marshal identitas yang diperbarui: %v", err)
	}

	return ctx.GetStub().PutPrivateData("collectionUserIdentities", id, updatedJSON)
}

// ========== 4. Fungsi untuk mendapatkan status VC (oleh pihak ketiga) ==========
// Fungsi ini memungkinkan pihak ketiga (atau siapa saja) untuk mengecek status verifikasi
// dari user tanpa melihat data sensitif.
func (s *SmartContract) GetVCStatus(ctx contractapi.TransactionContextInterface, id string, vcType string) (*VerificationVC, error) {
	identityJSON, err := ctx.GetStub().GetPrivateData("collectionUserIdentities", id)
	if err != nil {
		return nil, fmt.Errorf("gagal membaca data dari private collection: %v", err)
	}
	if identityJSON == nil {
		return nil, fmt.Errorf("user dengan ID '%s' tidak ditemukan", id)
	}

	var identity Identity
	err = json.Unmarshal(identityJSON, &identity)
	if err != nil {
		return nil, fmt.Errorf("gagal unmarshal JSON: %v", err)
	}

	vc, exists := identity.VerificationVC[vcType]
	if !exists {
		return nil, fmt.Errorf("jenis verifikasi '%s' tidak ditemukan untuk user ini", vcType)
	}

	return &vc, nil
}

// ========== 5. Fungsi untuk mendapatkan seluruh data identitas (hanya untuk validator) ==========
// Fungsi ini bersifat sensitif dan hanya bisa dipanggil oleh validator atau user itu sendiri.
func (s *SmartContract) GetIdentity(ctx contractapi.TransactionContextInterface, id string) (*Identity, error) {
	// Dapatkan MSP ID dari pemanggil fungsi
	callerMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("gagal mendapatkan MSP ID pemanggil: %v", err)
	}

	// Dapatkan UID dari pemanggil
	callerUID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("gagal mendapatkan UID pemanggil: %v", err)
	}

	// Jika pemanggil bukan validator DAN bukan user itu sendiri, tolak akses
	if callerMSPID != "OrgValidatorMSP" && callerUID != id {
		return nil, fmt.Errorf("hanya validator atau user pemilik data yang dapat mengakses fungsi ini")
	}

	identityJSON, err := ctx.GetStub().GetPrivateData("collectionUserIdentities", id)
	if err != nil {
		return nil, fmt.Errorf("gagal membaca data dari private collection: %v", err)
	}
	if identityJSON == nil {
		return nil, fmt.Errorf("user dengan ID '%s' tidak ditemukan", id)
	}

	var identity Identity
	err = json.Unmarshal(identityJSON, &identity)
	if err != nil {
		return nil, fmt.Errorf("gagal unmarshal JSON: %v", err)
	}

	return &identity, nil
}

// ========== Main function ==========
func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		panic(fmt.Sprintf("Gagal membuat chaincode identitas: %v", err))
	}

	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("Gagal memulai chaincode identitas: %v", err))
	}
}
