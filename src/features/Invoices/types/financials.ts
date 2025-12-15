// src/types/financials.ts

/**
 * Enum for cost categories
 */
export enum CostCategory {
    FUEL = 'FUEL',
    DRIVER_WAGES = 'DRIVER_WAGES',
    MAINTENANCE = 'MAINTENANCE',
    TOLLS = 'TOLLS',
    PERMITS = 'PERMITS',
    INSURANCE = 'INSURANCE',
    DEPRECIATION = 'DEPRECIATION',
    TAXES = 'TAXES',
    PARKING = 'PARKING',
    LOADING = 'LOADING',
    UNLOADING = 'UNLOADING',
    ACCOMMODATION = 'ACCOMMODATION',
    PER_DIEM = 'PER_DIEM',
    ADMIN = 'ADMIN',
    OTHER = 'OTHER'
  }
  
  /**
   * Interface for individual cost entries
   */
  export interface CostEntry {
    id: string;
    category: CostCategory;
    description: string;
    amount: number;
    currency: string;
    date: Date;
    relatedEntityType: 'SHIPMENT' | 'VEHICLE' | 'DRIVER' | 'MAINTENANCE' | 'GENERAL';
    relatedEntityId?: string;
    paymentMethod?: 'CASH' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'COMPANY_ACCOUNT' | 'ADVANCE' | 'REIMBURSEMENT';
    status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED' | 'REIMBURSED';
    receiptUrl?: string;
    notes?: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
    approvedAt?: Date;
    approvedBy?: string;
  }
  
  /**
   * Interface for revenue entries
   */
  export interface RevenueEntry {
    id: string;
    description: string;
    baseAmount: number;     // Base revenue amount
    taxAmount?: number;     // Tax amount
    discountAmount?: number; // Discount amount
    totalAmount: number;    // Total amount
    currency: string;
    date: Date;
    revenueType: 'FREIGHT' | 'STORAGE' | 'HANDLING' | 'EXPEDITED' | 'ACCESSORIAL' | 'OTHER';
    clientId: string;
    shipmentId?: string;
    invoiceId?: string;
    status: 'PENDING' | 'INVOICED' | 'PAID' | 'PARTIAL' | 'CANCELLED' | 'BAD_DEBT';
    paymentDueDate?: Date;
    paymentReceivedDate?: Date;
    notes?: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
  }
  
  /**
   * Interface for profit analysis per shipment
   */
  export interface ShipmentProfitability {
    shipmentId: string;
    shipmentReference: string;
    clientId: string;
    clientName: string;
    route: {
      origin: string;
      destination: string;
      distance: number;
      distanceUnit: 'km' | 'mi';
    };
    dates: {
      start: Date;
      end: Date;
      duration: number; // Hours
    };
    revenue: {
      baseAmount: number;
      additionalCharges: number;
      discounts: number;
      taxes: number;
      totalRevenue: number;
      currency: string;
    };
    costs: {
      fuelCosts: number;
      driverCosts: number;
      vehicleCosts: number;
      routeCosts: number; // Tolls, permits, etc.
      handlingCosts: number;
      adminCosts: number;
      otherCosts: number;
      totalCosts: number;
      currency: string;
    };
    profitability: {
      grossProfit: number;     // Revenue - Total Costs
      grossMargin: number;     // Percentage
      profitPerKm: number;     // Profit / Distance
      profitPerHour: number;   // Profit / Duration
    };
    notes?: string;
  }
  
  /**
   * Interface for periodic financial reporting
   */
  export interface FinancialReport {
    id: string;
    reportType: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM';
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    summary: {
      totalRevenue: number;
      totalCosts: number;
      grossProfit: number;
      grossMargin: number; // Percentage
      currency: string;
    };
    revenueBreakdown: {
      byClient: {
        clientId: string;
        clientName: string;
        amount: number;
        percentage: number;
      }[];
      byType: {
        revenueType: string;
        amount: number;
        percentage: number;
      }[];
    };
    costBreakdown: {
      byCategory: {
        category: CostCategory;
        amount: number;
        percentage: number;
      }[];
      fixedVsVariable: {
        fixed: number;
        variable: number;
        fixedPercentage: number;
      };
    };
    keyMetrics: {
      totalShipments: number;
      totalDistance: number;
      distanceUnit: 'km' | 'mi';
      revenuePerShipment: number;
      costPerShipment: number;
      revenuePerDistance: number;
      costPerDistance: number;
      averageShipmentDuration: number; // Hours
    };
    trends?: {
      revenueChange: number; // Percentage compared to previous period
      costChange: number;    // Percentage compared to previous period
      marginChange: number;  // Percentage points change
    };
    generatedAt: Date;
    generatedBy: string;
    notes?: string;
  }
  
  /**
   * Interface for pricing models
   */
  export interface PricingModel {
    id: string;
    name: string;
    description?: string;
    applicableClients: string[] | 'ALL'; // Client IDs or 'ALL'
    effectiveFrom: Date;
    effectiveTo?: Date;
    isActive: boolean;
    baseRates: {
      perDistance: {
        rate: number;
        unit: 'km' | 'mi';
      };
      perWeight?: {
        rate: number;
        unit: 'kg' | 'lb' | 't';
      };
      perVolume?: {
        rate: number;
        unit: 'm³' | 'ft³';
      };
      perHour?: {
        rate: number;
      };
      minimumCharge: number;
    };
    additionalCharges: {
      id: string;
      name: string;
      description?: string;
      type: 'FIXED' | 'PERCENTAGE' | 'PER_UNIT';
      value: number;
      unit?: string;
      conditions?: string;
    }[];
    discounts: {
      id: string;
      name: string;
      description?: string;
      type: 'FIXED' | 'PERCENTAGE';
      value: number;
      conditions?: string;
    }[];
    specialRates?: {
      id: string;
      description: string;
      conditions: string;
      rate: number;
      unit?: string;
    }[];
    currency: string;
    paymentTerms: string;
    notes?: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
  }
  
  /**
   * Interface for budget allocation and tracking
   */
  export interface BudgetAllocation {
    id: string;
    category: CostCategory;
    name: string;
    description?: string;
    allocationPeriod: {
      startDate: Date;
      endDate: Date;
    };
    allocatedAmount: number;
    spentAmount: number;
    remainingAmount: number;
    currency: string;
    status: 'ACTIVE' | 'CLOSED' | 'OVER_BUDGET';
    relatedEntityType?: 'VEHICLE' | 'DRIVER' | 'ROUTE' | 'DEPARTMENT';
    relatedEntityId?: string;
    notes?: string;
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
  }