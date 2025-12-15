// src/features/Invoices/components/CompanySettings.tsx
// FIXED VERSION - Replace your current file with this
import React, { useState } from 'react';
import CompanyService, { type CompanyInfo } from '../services/CompanyService';

interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
  warnings: string[];
}

export const CompanySettings: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(
    CompanyService.getCompanyInfo()
  );
  const [validation, setValidation] = useState<ValidationResult>(
    CompanyService.validateCompanyInfo()
  );

  const handleSave = () => {
    CompanyService.updateCompanyInfo(companyInfo);
    setValidation(CompanyService.validateCompanyInfo());
  };

  const handleReset = () => {
    CompanyService.resetToDefaults();
    setCompanyInfo(CompanyService.getCompanyInfo());
  };

  return (
    <div className="company-settings">
      <h3>Company Information</h3>
      
      {/* Company Name */}
      <div className="form-group">
        <label>Company Name *</label>
        <input
          type="text"
          value={companyInfo.name}
          onChange={(e) => setCompanyInfo({
            ...companyInfo,
            name: e.target.value
          })}
        />
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Address *</label>
        <textarea
          value={companyInfo.address}
          onChange={(e) => setCompanyInfo({
            ...companyInfo,
            address: e.target.value
          })}
          rows={3}
        />
      </div>

      {/* Contact Info */}
      <div className="form-row">
        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            value={companyInfo.phone}
            onChange={(e) => setCompanyInfo({
              ...companyInfo,
              phone: e.target.value
            })}
          />
        </div>
        
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={companyInfo.email}
            onChange={(e) => setCompanyInfo({
              ...companyInfo,
              email: e.target.value
            })}
          />
        </div>
      </div>

      {/* Validation Messages */}
      {!validation.isValid && (
        <div className="validation-errors">
          <h4>Missing Required Fields:</h4>
          <ul>
            {validation.missingFields.map((field: string) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="validation-warnings">
          <h4>Recommendations:</h4>
          <ul>
            {validation.warnings.map((warning: string, index: number) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="form-actions">
        <button onClick={handleSave} disabled={!validation.isValid}>
          Save Changes
        </button>
        <button onClick={handleReset} type="button">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};