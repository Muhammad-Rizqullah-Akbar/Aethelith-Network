// apps/web/src/app/validator/templates/page.tsx
'use client';

import { useState } from 'react';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineEye, AiOutlineCloseCircle, AiOutlineCheckCircle, AiOutlineClose, AiOutlineTool, AiOutlineIdcard } from 'react-icons/ai';
import styles from './validator-audit.module.css';

const dummyCredentials = [
  { id: 'vc-001', subject: 'sub-a9b1c2d3...', type: 'KYC Verified', status: 'Aktif', issuedDate: '2025-07-20', expiryDate: '2026-07-20', data: { name: 'Budi Santoso', nik: '123456789' } },
  { id: 'vc-002', subject: 'sub-e5a3f12b...', type: 'Sertifikasi Profesi', status: 'Dicabut', issuedDate: '2025-07-18', expiryDate: '2026-07-18', reason: 'Kredensial kedaluwarsa', data: { name: 'Siti Rahayu', idProfesi: '987654321' } },
  { id: 'vc-003', subject: 'sub-f8c4d21a...', type: 'Verifikasi Usia', status: 'Aktif', issuedDate: '2025-07-15', expiryDate: '2027-07-15', data: { name: 'Joko Widodo', dob: '1980-01-01' } },
  { id: 'vc-004', subject: 'sub-a9b1c2d3...', type: 'Sertifikasi Profesi', status: 'Aktif', issuedDate: '2025-07-10', expiryDate: '2026-07-10', data: { name: 'Budi Santoso', idProfesi: '555444333' } },
  { id: 'vc-005', subject: 'sub-z2x3c4v5...', type: 'KYC Verified', status: 'Aktif', issuedDate: '2025-07-05', expiryDate: '2026-07-05', data: { name: 'Dewi Lestari', nik: '1122334455' } },
];

export default function ValidatorAuditPage() {
  const [credentials, setCredentials] = useState(dummyCredentials);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<any>(null);

  // State untuk form penerbitan manual
  const [newSubject, setNewSubject] = useState('');
  const [newType, setNewType] = useState('KYC Verified');
  const [newData, setNewData] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const handleManualIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    try {
      const parsedData = JSON.parse(newData);
      const newCredential = {
        id: `vc-${Math.random().toString(36).substr(2, 9)}`,
        subject: newSubject,
        type: newType,
        status: 'Aktif',
        issuedDate: new Date().toISOString().slice(0, 10),
        expiryDate: new Date(Date.now() + 31536000000).toISOString().slice(0, 10), // +1 tahun
        data: parsedData,
      };
      setCredentials([newCredential, ...credentials]);
      setNewSubject('');
      setNewData('');
      setIsFormSubmitted(true);
      setTimeout(() => setIsFormSubmitted(false), 3000);
    } catch (e) {
      setSubmissionError('Data Klaim tidak dalam format JSON yang valid.');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value);
  const handleViewDetails = (credential: any) => { setSelectedCredential(credential); setIsModalOpen(true); };
  const handleRevoke = (id: string) => {
    const updatedCredentials = credentials.map(cred =>
      cred.id === id ? { ...cred, status: 'Dicabut', reason: 'Dicabut oleh validator' } : cred
    );
    setCredentials(updatedCredentials);
    setIsModalOpen(false);
  };

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cred.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'Semua' || cred.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Aktif': return styles.statusActive;
      case 'Dicabut': return styles.statusRevoked;
      case 'Kedaluwarsa': return styles.statusExpired;
      default: return '';
    }
  };

  return (
    <div className={styles.auditContainer}>
      <header className={styles.auditHeader}>
        <h1 className={styles.auditTitle}>
          <AiOutlineTool className={styles.headerIcon} />
          Manajemen Kredensial
        </h1>
        <p className={styles.auditDescription}>
          Pusat kendali untuk menerbitkan, meninjau, dan mengaudit seluruh kredensial yang dikeluarkan oleh instansi Anda.
        </p>
      </header>

      {/* --- Bagian Penerbitan Manual --- */}
      <section className={`${styles.section} ${styles.issueSection}`}>
        <h2 className={styles.sectionTitle}>Penerbitan Kredensial Manual</h2>
        <form onSubmit={handleManualIssue} className={styles.issueForm}>
          {submissionError && <p className={styles.errorText}>{submissionError}</p>}
          {isFormSubmitted && <p className={styles.successText}>Kredensial berhasil diterbitkan!</p>}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="subjectId">ID Subjek</label>
              <input type="text" id="subjectId" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className={styles.formInput} placeholder="contoh: did:ethr:0x123..." required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="credentialType">Tipe Kredensial</label>
              <select id="credentialType" value={newType} onChange={(e) => setNewType(e.target.value)} className={styles.formSelect} required>
                <option value="KYC Verified">KYC Verified</option>
                <option value="Sertifikasi Profesi">Sertifikasi Profesi</option>
                <option value="Verifikasi Usia">Verifikasi Usia</option>
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="claimData">Data Klaim (JSON)</label>
            <textarea id="claimData" value={newData} onChange={(e) => setNewData(e.target.value)} className={styles.formTextarea} rows={6} placeholder={`{\n  "name": "nama lengkap",\n  "nik": "nomor_nik"\n}`} required></textarea>
          </div>
          <button type="submit" className={styles.issueButton}>Terbitkan Kredensial</button>
        </form>
      </section>

      {/* --- Bagian Riwayat/Audit Kredensial --- */}
      <section className={`${styles.section} ${styles.historySection}`}>
        <h2 className={styles.sectionTitle}>Riwayat & Audit Kredensial</h2>
        <div className={styles.filterBar}>
          <div className={styles.searchInputGroup}>
            <AiOutlineSearch className={styles.searchIcon} />
            <input type="text" placeholder="Cari ID Kredensial atau Subjek" value={searchQuery} onChange={handleSearch} className={styles.searchInput} />
          </div>
          <div className={styles.filterInputGroup}>
            <AiOutlineFilter className={styles.filterIcon} />
            <select value={filterStatus} onChange={handleStatusFilter} className={styles.filterSelect}>
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Dicabut">Dicabut</option>
            </select>
          </div>
        </div>
        <div className={styles.tableResponsive}>
          <table className={styles.credentialTable}>
            <thead>
              <tr>
                <th>ID Kredensial</th>
                <th>Subjek</th>
                <th>Tipe</th>
                <th>Status</th>
                <th>Tanggal Terbit</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCredentials.length > 0 ? (
                filteredCredentials.map((cred) => (
                  <tr key={cred.id} className={styles.tableRow}>
                    <td className={styles.tableData}>{cred.id}</td>
                    <td className={styles.tableData}>{cred.subject}</td>
                    <td className={styles.tableData}>{cred.type}</td>
                    <td className={`${styles.tableData} ${getStatusClass(cred.status)}`}>
                      {cred.status === 'Aktif' && <AiOutlineCheckCircle className={styles.statusIcon} />}
                      {cred.status === 'Dicabut' && <AiOutlineCloseCircle className={styles.statusIcon} />}
                      {cred.status}
                    </td>
                    <td className={styles.tableData}>{cred.issuedDate}</td>
                    <td className={styles.tableData}>
                      <button onClick={() => handleViewDetails(cred)} className={styles.actionButton}>
                        <AiOutlineEye /> Detail
                      </button>
                      {cred.status === 'Aktif' && (
                        <button onClick={() => handleRevoke(cred.id)} className={`${styles.actionButton} ${styles.revokeButton}`}>
                          <AiOutlineCloseCircle /> Cabut
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.tableEmpty}>Tidak ada kredensial ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && selectedCredential && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Detail Kredensial</h3>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalCloseButton}>
                <AiOutlineClose />
              </button>
            </div>
            <div className={styles.credentialDetails}>
              <p><strong>ID Kredensial:</strong> {selectedCredential.id}</p>
              <p><strong>Subjek:</strong> {selectedCredential.subject}</p>
              <p><strong>Tipe:</strong> {selectedCredential.type}</p>
              <p><strong>Status:</strong> <span className={getStatusClass(selectedCredential.status)}>{selectedCredential.status}</span></p>
              <p><strong>Tanggal Terbit:</strong> {selectedCredential.issuedDate}</p>
              <p><strong>Tanggal Kedaluwarsa:</strong> {selectedCredential.expiryDate}</p>
              {selectedCredential.status === 'Dicabut' && (
                <p className={styles.revokeReason}><strong>Alasan Pencabutan:</strong> {selectedCredential.reason}</p>
              )}
              <div className={styles.claimData}>
                <h4>Data Klaim:</h4>
                <pre>{JSON.stringify(selectedCredential.data, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}