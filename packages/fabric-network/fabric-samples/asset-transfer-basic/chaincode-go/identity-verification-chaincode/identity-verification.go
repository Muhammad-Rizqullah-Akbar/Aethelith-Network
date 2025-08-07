package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)



type Identity struct {
	ID             string                  `json:"id"`             
	FullName       string                  `json:"fullName"`       
	NIK            string                  `json:"nik"`            
	BirthPlace     string                  `json:"birthPlace"`     
	BirthDate      string                  `json:"birthDate"`      
	Address        string                  `json:"address"`        
	Email          string                  `json:"email"`          
	VerificationVC map[string]VerificationVC `json:"verificationVC"` 
}



type VerificationVC struct {
	Status   string `json:"status"`   
	IssuedBy string `json:"issuedBy"` 
	IssuedAt string `json:"issuedAt"` 
	DataHash string `json:"dataHash"` 
}


type SmartContract struct {
	contractapi.Contract
}



func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	
	return nil
}




func (s *SmartContract) RegisterIdentity(ctx contractapi.TransactionContextInterface, id string, fullName string, email string, nik string, birthPlace string, birthDate string, address string) error {
	
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
		VerificationVC: make(map[string]VerificationVC), 
	}

	identityJSON, err = json.Marshal(identity)
	if err != nil {
		return fmt.Errorf("gagal marshal identitas ke JSON: %v", err)
	}

	
	
	return ctx.GetStub().PutPrivateData("collectionUserIdentities", id, identityJSON)
}





func (s *SmartContract) RequestVerification(ctx contractapi.TransactionContextInterface, id string, vcType string) error {
	
	userMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("gagal mendapatkan MSP ID pemanggil: %v", err)
	}
	
	if userMSPID != "Org1MSP" {
    	return fmt.Errorf("hanya user yang bisa mengajukan verifikasi")
	}

	
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

	
	identity.VerificationVC[vcType] = VerificationVC{
		Status: "pending",
	}

	updatedJSON, err := json.Marshal(identity)
	if err != nil {
		return fmt.Errorf("gagal marshal identitas yang diperbarui: %v", err)
	}

	return ctx.GetStub().PutPrivateData("collectionUserIdentities", id, updatedJSON)
}




func (s *SmartContract) ValidateIdentity(ctx contractapi.TransactionContextInterface, id string, vcType string, dataHash string) error {
	
	validatorMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return fmt.Errorf("gagal mendapatkan MSP ID pemanggil: %v", err)
	}
	
	if validatorMSPID != "Org2MSP" {
    	return fmt.Errorf("hanya validator yang bisa memverifikasi identitas")
	}

	
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

	
	if _, exists := identity.VerificationVC[vcType]; !exists {
		return fmt.Errorf("jenis verifikasi '%s' belum diajukan oleh user", vcType)
	}

	
	timestamp, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return fmt.Errorf("failed to get transaction timestamp: %v", err)
	}
	issuedAt := time.Unix(timestamp.GetSeconds(), int64(timestamp.GetNanos())).String()

	
	identity.VerificationVC[vcType] = VerificationVC{
		Status:   "verified",
		IssuedBy: validatorMSPID,
		IssuedAt: issuedAt,
		DataHash: dataHash, 
	}

	updatedJSON, err := json.Marshal(identity)
	if err != nil {
		return fmt.Errorf("gagal marshal identitas yang diperbarui: %v", err)
	}

	return ctx.GetStub().PutPrivateData("collectionUserIdentities", id, updatedJSON)
}




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



func (s *SmartContract) GetIdentity(ctx contractapi.TransactionContextInterface, id string) (*Identity, error) {
	// Ambil MSP ID pemanggil
	callerMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("gagal mendapatkan MSP ID pemanggil: %v", err)
	}

	// Ambil UID (x509 identity) pemanggil
	callerUID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("gagal mendapatkan UID pemanggil: %v", err)
	}

	// Logging ke stdout (akan terlihat di Docker logs)
	fmt.Printf("[GET_IDENTITY] Permintaan dari MSP ID: %s, UID: %s\n", callerMSPID, callerUID)

	// Ambil data dari private collection
	identityJSON, err := ctx.GetStub().GetPrivateData("collectionUserIdentities", id)
	if err != nil {
		return nil, fmt.Errorf("gagal membaca data dari private collection: %v", err)
	}
	if identityJSON == nil {
		return nil, fmt.Errorf("user dengan ID '%s' tidak ditemukan", id)
	}

	// Unmarshal JSON ke struct
	var identity Identity
	err = json.Unmarshal(identityJSON, &identity)
	if err != nil {
		return nil, fmt.Errorf("gagal unmarshal JSON: %v", err)
	}

	// Validasi hak akses: hanya Org2 (validator) atau pemilik data
	if callerMSPID != "Org2MSP" && callerUID != identity.ID {
		return nil, fmt.Errorf("hanya validator atau user pemilik data yang dapat mengakses fungsi ini")
	}

	return &identity, nil
}



func main() {
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		panic(fmt.Sprintf("Gagal membuat chaincode identitas: %v", err))
	}

	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("Gagal memulai chaincode identitas: %v", err))
	}
}
