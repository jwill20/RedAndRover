

export class Utils {
    public async base64Decode(stringToDecode: string): Promise<string> {
        console.log('service:base64Decode => Invoked');
      
        let decoded = Buffer.from(stringToDecode, "base64").toString();
      
        return decoded;
       }
    
} 

   