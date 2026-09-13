export interface ComponentMethods {
  Info(info: any): string;
  Error(error: any): string;
  Warn(warn: any): string;
  FunctionInfo(funName: string, info: any): string;
  FunctionStatus(function_name: string, return_info: any): string;
  FunctionPrint(funName: string, text: any): string;
  FunctionPositivePerformance(funName: string, text: any): string;
  FunctionNegativePerformance(funName: string, text: any): string;
}

export interface PrintInterface {
  // --- Server ---
  ServerInfo(info: any): string;
  ServerError(error: any): string;
  ServerWarn(warn: any): string;
  ServerFunctionInfo(funName: string, info: any): string;
  ServerFunctionStatus(function_name: string, return_info: any): string;
  ServerFunctionPrint(funName: string, text: any): string;
  ServerFunctionPositivePerformance(funName: string, text: any): string;
  ServerFunctionNegativePerformance(funName: string, text: any): string;

  // --- Socket ---
  SocketInfo(info: any): string;
  SocketError(error: any): string;
  SocketWarn(warn: any): string;
  SocketFunctionInfo(funName: string, info: any): string;
  SocketFunctionStatus(function_name: string, return_info: any): string;
  SocketFunctionPrint(funName: string, text: any): string;
  SocketFunctionPositivePerformance(funName: string, text: any): string;
  SocketFunctionNegativePerformance(funName: string, text: any): string;

  // --- Writter ---
  WritterInfo(info: any): string;
  WritterError(error: any): string;
  WritterWarn(warn: any): string;
  WritterFunctionInfo(funName: string, info: any): string;
  WritterFunctionStatus(function_name: string, return_info: any): string;
  WritterFunctionPrint(funName: string, text: any): string;
  WritterFunctionPositivePerformance(funName: string, text: any): string;
  WritterFunctionNegativePerformance(funName: string, text: any): string;

  // --- Database ---
  DatabaseInfo(info: any): string;
  DatabaseError(error: any): string;
  DatabaseWarn(warn: any): string;
  DatabaseFunctionInfo(funName: string, info: any): string;
  DatabaseFunctionStatus(function_name: string, return_info: any): string;
  DatabaseFunctionPrint(funName: string, text: any): string;
  DatabaseFunctionPositivePerformance(funName: string, text: any): string;
  DatabaseFunctionNegativePerformance(funName: string, text: any): string;

  // --- Nodemailer ---
  NodemailerInfo(info: any): string;
  NodemailerError(error: any): string;
  NodemailerWarn(warn: any): string;
  NodemailerFunctionInfo(funName: string, info: any): string;
  NodemailerFunctionStatus(function_name: string, return_info: any): string;
  NodemailerFunctionPrint(funName: string, text: any): string;
  NodemailerFunctionPositivePerformance(funName: string, text: any): string;
  NodemailerFunctionNegativePerformance(funName: string, text: any): string;
  NodemailerFunctionPositiveSending(gmail: string): string;
  NodemailerFunctionNegativeSending(gmail: string): string;
}

// Защита: экспортируем как неизменяемую константу-объект
export const print: Readonly<PrintInterface>;

export default print;
