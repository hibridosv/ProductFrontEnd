export const numberToMoney = (number: number): string => {
    return `$${number.toFixed(2)}`
}

export const getConfigStatus = (feature: string, config: any)=>{
    if (config?.configurations) {
     return config.configurations.find((configuration: any) => configuration.feature === feature)?.active === 1
    }
    return false
  }

export const fieldWidth = (field: string): string => {
    switch (field) {
      case "full": return "w-full px-3 mb-2"
      case "medio": return "w-full md:w-1/2 px-3 mb-2"
      case "tercio": return "w-full md:w-1/3 px-3 mb-2"
      default: return "w-full md:w-1/2 px-3 mb-2"
    }
}