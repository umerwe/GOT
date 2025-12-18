export const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "live":
      case "approved":
        return "bg-green-500"
      case "pending":
        return "bg-orange-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }