import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as mongoDB from "mongodb";

let psPool;
let mongoClient;

@Injectable()
export class RoverService {
  private readonly logger = new Logger(RoverService.name);

  /**********************************************************/
  /* Constructor                                            */
  /**********************************************************/
  constructor(private readonly configService: ConfigService) { 
    this.logger.log('service:constructor => Ready for action');
    
    const postgresPool = new Pool ({
      max: 20,
      connectionString: 'postgres://' + 
      configService.get<string>("POSTGRES_USER") + 
      ':' + configService.get<string>("POSTGRES_PASSWORD") + 
      '@' + configService.get<string>("POSTGRES_HOST") + 
      ':' + configService.get<string>("POSTGRES_PORT") + 
      '/' + configService.get<string>("POSTGRES_DB"),
      idleTimeoutMillis: 30000
    });

    psPool = postgresPool;

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(configService.get<string>("MONGO_CONN_STRING"));
    mongoClient = client;

    this.logger.log(psPool.options.connectionString);
}
  
  /**********************************************************/
  /* pingPostGres                                           */
  /**********************************************************/
  async pingPostgres(): Promise<string> {
     this.logger.log('service:pingPostgres => Invoked');
     
    try {
      const client = await psPool.connect();
      const sql = "SELECT hobby FROM characters where \"firstName\" = 'Russell'";
      const { rows } = await client.query(sql);
      this.logger.log('service:pingPostgres => Good read from Postgres');
      if (rows[0]) {
        this.logger.log("service:pingPostgres => Found Red in DB");
        client.release();
        return "Red Enjoys " + rows[0].hobby;
      } else {
        this.logger.log("service:pingPostgres => Cannot find Red in DB");
        client.release();
        return "Do not know what things Red enjoys";
      }
    } catch (error) {
      this.logger.log('service:pingPostgres => Bad things happened');
      this.logger.log(error)
      return "Do not know what things Red enjoys";
    }
  }
  /**********************************************************/
  /* loadMongo from Postgres                                */
  /**********************************************************/
  async loadMongo(): Promise<string> {
    this.logger.log('service:loadMongo => Invoked');

    
   try {
     await mongoClient.connect();
     const db: mongoDB.Db = mongoClient.db("Rover");
     const redAndRoverCollection: mongoDB.Collection = db.collection("RedAndRover");
     
     let pgRows = await this.readPostgres();

     let rec = {
       firstName: "",
       lastName: "",
       age: 0,
       nickName: "",
       occupation: "",
       hobby: "",
       favoriteBand: ""
     };

     for (let a = 0; a < pgRows.length; a++) {
       let record = Object.create(rec);

       record.firstName = pgRows[a].firstName.trim(); 
       record.lastName = pgRows[a].lastName.trim();
       record.age = pgRows[a].age;
       record.nickName = pgRows[a].nickName.trim();
       record.occupation = pgRows[a].occupation.trim();
       record.hobby = pgRows[a].hobby.trim();
       record.favoriteBand = pgRows[a].favoriteBand.trim();
       console.log(await redAndRoverCollection.insertOne(record));
     }
     
     this.logger.log('service:loadMongo => Mongo loaded from Postgres');
     return "Mongo loaded from Postgres";
   } catch (error) {
     this.logger.log('service:loadMongo => Bad things happened');
     this.logger.log(error)
     return "Bad things happened";
   }
 }

 /**********************************************************/
  /* readPostGres                                           */
  /**********************************************************/
  async readPostgres(): Promise<any[]> {
    this.logger.log('service:readPostgres => Invoked');
    
   try {
     const client = await psPool.connect();
     const sql = "SELECT * FROM characters";
     const { rows } = await client.query(sql);
     this.logger.log('service:readPostgres => Postgres query complete');
     if (rows[0]) {
       this.logger.log("service:readPostgres => Found data in Postgres DB");
       client.release();
       return rows;
     } else {
       this.logger.log("service:pingPostgres => Cannot find Red in DB");
       client.release();
       return rows;
     }
   } catch (error) {
     this.logger.log('service:pingPostgres => Bad things happened');
     this.logger.log(error)
     return [];
   }
 }

  /**********************************************************/
  /* readMongo                                              */
  /**********************************************************/
  async readMongo(): Promise<string> {
    this.logger.log('service:readMongo => Invoked');

    
   try {
     await mongoClient.connect();
     const db: mongoDB.Db = mongoClient.db("Rover");
     const redAndRoverCollection: mongoDB.Collection = db.collection("RedAndRover");
     redAndRoverCollection.find({}).toArray(); 

      
     this.logger.log('service:readMongo => Good read from Mongo');
     return "Good things";
   } catch (error) {
     this.logger.log('service:readMongo => Bad things happened');
     this.logger.log(error)
     return "Bad things happening";
   }
 }

 /**********************************************************/
 /* pingMongo                                              */
 /**********************************************************/
  async pingMongo(firstName: string): Promise<string> {
    this.logger.log('service:pingMongo => Invoked');
    
    try {
      await mongoClient.connect();
      const db: mongoDB.Db = mongoClient.db("Rover");
      const redAndRoverCollection: mongoDB.Collection = db.collection("RedAndRover");
      let result = await redAndRoverCollection.find({"firstName": firstName}).toArray(); 

      if (result.length) {
        this.logger.log('service:pingMongo => Found Red in Mongo');
        return "Red Enjoys " + result[0].hobby;
      } else {
        this.logger.log('service:pingMongo => Did not find Red in Mongo');
        return "Do Not Know What Red Enjoys";
      }
      
    } catch (error) {
      this.logger.log('service:pingMongo => Bad things happened');
      this.logger.log(error)
      return "Do not know what things Red enjoys";
    }
 }

 /**********************************************************/
 /* base64Decode                                           */
 /**********************************************************/
  async base64Decode(stringToDecode: string): Promise<string> {
  this.logger.log('service:base64Decode => Invoked');

  let decoded = Buffer.from(stringToDecode, "base64").toString();

  return decoded;
 }
 

 

}

