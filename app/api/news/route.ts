// app/api/news/route.ts

import { NextResponse } from "next/server";
import {
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
 
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get("project");
    const type = searchParams.get("type") || "Case Study"; 

    if (!project) {
      console.warn("🚫 Missing project param");
      return NextResponse.json({ error: "Missing project" }, { status: 400 });
    }

    console.log("🔍 Filters:", { project, type });

    const command = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME!,
      FilterExpression: "#type = :type AND #project = :project",
      ExpressionAttributeNames: {
        "#type": "type",
        "#project": "project",
      },
      ExpressionAttributeValues: {
        ":type": { S: type },
        ":project": { S: project },
      },
    });

    const result = await client.send(command);

    console.log("📦 Raw Items:", result.Items?.length, result.Items);

    const items =
      result.Items?.map((item) => unmarshall(item as Record<string, any>)) ?? [];

    console.log("✅ Parsed Items:", items.length, items);

    return NextResponse.json(items);
  } catch (error) {
    console.error("💥 API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
