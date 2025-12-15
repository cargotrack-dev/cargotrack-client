// src/features/Invoices/services/CompanyService.ts
// Place this file in: client/src/features/Invoices/services/CompanyService.ts
interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  logo?: string;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    iban?: string;
    swift?: string;
  };
  registrationInfo?: {
    registrationNumber: string;
    registeredOffice: string;
    incorporationDate: string;
  };
}

/**
 * Service for managing company information used in invoices and documents
 */
class CompanyService {
  private static companyInfo: CompanyInfo | null = null;

  /**
   * Get company information
   * @returns Company information object
   */
  static getCompanyInfo(): CompanyInfo {
    // If we have cached company info, return it
    if (this.companyInfo) {
      return this.companyInfo;
    }

    // Try to load from localStorage for persistence
    const storedInfo = localStorage.getItem('cargotrack_company_info');
    if (storedInfo) {
      try {
        this.companyInfo = JSON.parse(storedInfo);
        return this.companyInfo!;
      } catch (error) {
        console.warn('Failed to parse stored company info:', error);
      }
    }

    // Return default company information
    this.companyInfo = this.getDefaultCompanyInfo();
    return this.companyInfo;
  }

  /**
   * Update company information
   * @param updates Partial company info to update
   */
  static updateCompanyInfo(updates: Partial<CompanyInfo>): void {
    const currentInfo = this.getCompanyInfo();
    this.companyInfo = { ...currentInfo, ...updates };
    
    // Persist to localStorage
    try {
      localStorage.setItem('cargotrack_company_info', JSON.stringify(this.companyInfo));
    } catch (error) {
      console.warn('Failed to save company info to localStorage:', error);
    }
  }

  /**
   * Reset company information to defaults
   */
  static resetToDefaults(): void {
    this.companyInfo = this.getDefaultCompanyInfo();
    localStorage.removeItem('cargotrack_company_info');
  }

  /**
   * Validate company information completeness
   * @returns Object with validation results
   */
  static validateCompanyInfo(): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
  } {
    const info = this.getCompanyInfo();
    const missingFields: string[] = [];
    const warnings: string[] = [];

    // Required string fields
    const requiredStringFields: Array<keyof Pick<CompanyInfo, 'name' | 'address' | 'phone' | 'email'>> = [
      'name', 'address', 'phone', 'email'
    ];

    requiredStringFields.forEach(field => {
      const value = info[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingFields.push(field);
      }
    });

    // Warnings for recommended fields
    if (!info.website || info.website.trim() === '') {
      warnings.push('Website URL is recommended for professional invoices');
    }

    if (!info.taxId || info.taxId.trim() === '') {
      warnings.push('Tax ID is recommended for tax reporting');
    }

    if (!info.logo || info.logo.trim() === '') {
      warnings.push('Company logo adds professionalism to invoices');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings
    };
  }

  /**
   * Get default company information
   * @returns Default company info
   */
  private static getDefaultCompanyInfo(): CompanyInfo {
    return {
      name: 'CargoTrack Logistics Ltd.',
      address: '1234 Logistics Drive\nShipping District\nLagos, Nigeria 100001',
      phone: '+234 1 234 5678',
      email: 'info@cargotrack.com',
      website: 'https://www.cargotrack.com',
      taxId: 'NG123456789',
      logo: '/assets/images/cargotrack-logo.png',
      bankDetails: {
        bankName: 'First Bank of Nigeria',
        accountName: 'CargoTrack Logistics Ltd.',
        accountNumber: '1234567890',
        routingNumber: '011152303',
        iban: 'NG21FBNK00000001234567890',
        swift: 'FBINNGLAXXX'
      },
      registrationInfo: {
        registrationNumber: 'RC123456',
        registeredOffice: '1234 Logistics Drive, Lagos, Nigeria',
        incorporationDate: '2020-01-15'
      }
    };
  }

  /**
   * Get company logo as base64 data URL
   * @returns Promise resolving to base64 image data or null
   */
  static async getCompanyLogoAsDataUrl(): Promise<string | null> {
    const info = this.getCompanyInfo();
    
    if (!info.logo) {
      return null;
    }

    try {
      // If it's already a data URL, return it
      if (info.logo.startsWith('data:')) {
        return info.logo;
      }

      // Otherwise, fetch the image and convert to base64
      const response = await fetch(info.logo);
      if (!response.ok) {
        throw new Error(`Failed to fetch logo: ${response.statusText}`);
      }

      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn('Failed to load company logo:', error);
      return null;
    }
  }

  /**
   * Format company address for display
   * @param separator Line separator (default: '\n')
   * @returns Formatted address string
   */
  static getFormattedAddress(separator: string = '\n'): string {
    const info = this.getCompanyInfo();
    return info.address.split('\n').join(separator);
  }

  /**
   * Get company contact info formatted for display
   * @returns Formatted contact information
   */
  static getFormattedContactInfo(): {
    phone: string;
    email: string;
    website: string;
  } {
    const info = this.getCompanyInfo();
    
    return {
      phone: info.phone,
      email: info.email,
      website: info.website || ''
    };
  }

  /**
   * Check if company has complete banking information
   * @returns True if banking details are complete
   */
  static hasBankingInfo(): boolean {
    const info = this.getCompanyInfo();
    return !!(
      info.bankDetails?.bankName &&
      info.bankDetails?.accountName &&
      info.bankDetails?.accountNumber
    );
  }

  /**
   * Get banking information for payment instructions
   * @returns Banking details or null if incomplete
   */
  static getBankingInfo(): CompanyInfo['bankDetails'] | null {
    const info = this.getCompanyInfo();
    
    if (!this.hasBankingInfo()) {
      return null;
    }

    return info.bankDetails || null;
  }

  /**
   * Export company information for backup
   * @returns JSON string of company info
   */
  static exportCompanyInfo(): string {
    return JSON.stringify(this.getCompanyInfo(), null, 2);
  }

  /**
   * Import company information from backup
   * @param jsonData JSON string of company info
   * @returns Success status
   */
  static importCompanyInfo(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData) as CompanyInfo;
      
      // Validate required fields
      if (!imported.name || !imported.address || !imported.phone || !imported.email) {
        throw new Error('Missing required fields in imported data');
      }

      this.updateCompanyInfo(imported);
      return true;
    } catch (error) {
      console.error('Failed to import company info:', error);
      return false;
    }
  }

  /**
   * Clear cached company information (force reload)
   */
  static clearCache(): void {
    this.companyInfo = null;
  }
}

export default CompanyService;
export type { CompanyInfo };