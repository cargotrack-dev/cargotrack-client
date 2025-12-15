// src/services/CompanyService.ts

/**
 * Company information type
 */
export interface CompanyInfo {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
    logo?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * Service to manage company information
   */
  class CompanyService {
    private static instance: CompanyService;
    private companyInfo: CompanyInfo;
  
    private constructor() {
      // Initialize with default company info
      this.companyInfo = {
        id: '1',
        name: 'CargoTrack Pro',
        address: '123 Logistics Avenue\nSuite 400',
        city: 'Transport City',
        state: 'TC',
        zipCode: '12345',
        country: 'United States',
        phone: '(123) 456-7890',
        email: 'info@cargotrackpro.com',
        website: 'www.cargotrackpro.com',
        taxId: 'TAX-12345678',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
  
      // In a real app, you would load this from local storage or API
      this.loadFromStorage();
    }
  
    /**
     * Get the singleton instance
     */
    public static getInstance(): CompanyService {
      if (!CompanyService.instance) {
        CompanyService.instance = new CompanyService();
      }
      return CompanyService.instance;
    }
  
    /**
     * Get the company information
     */
    public static getCompanyInfo(): CompanyInfo {
      return CompanyService.getInstance().companyInfo;
    }
  
    /**
     * Update company information
     */
    public static updateCompanyInfo(info: Partial<CompanyInfo>): CompanyInfo {
      const instance = CompanyService.getInstance();
      instance.companyInfo = {
        ...instance.companyInfo,
        ...info,
        updatedAt: new Date().toISOString()
      };
  
      // In a real app, you would save this to local storage or API
      instance.saveToStorage();
      
      return instance.companyInfo;
    }
  
    /**
     * Load company info from storage (localStorage in browser)
     */
    private loadFromStorage(): void {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('companyInfo');
        if (stored) {
          try {
            this.companyInfo = JSON.parse(stored);
          } catch (error) {
            console.error('Failed to parse company info from storage', error);
          }
        }
      }
    }
  
    /**
     * Save company info to storage (localStorage in browser)
     */
    private saveToStorage(): void {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('companyInfo', JSON.stringify(this.companyInfo));
      }
    }
  }
  
  export default CompanyService;