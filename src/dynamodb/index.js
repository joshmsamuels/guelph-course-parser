import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
})

const MAX_ITEMS_PER_BATCH = 25

export async function storeInDynamoDB({courseData, schoolShortCode}) {
    // TODO: INVESTIGATE - would there be a benefit to computing the size of
    // balanced batch sizes when calling chunkArray(...)?
    await Promise.all(chunkArray(courseData, MAX_ITEMS_PER_BATCH).map(courseChunk => {
        return batchWrite({
            courseData: courseChunk, 
            schoolShortCode: schoolShortCode,
        })
    }))
}

async function batchWrite({courseData, schoolShortCode}) {
    const params = {
        RequestItems: {
            'CourseData_tmp': courseData.map((course) => {
                const massagedCourse = course
                massagedCourse.CourseId = course.CourseCode
                massagedCourse.SchoolShortCode = schoolShortCode

                return {
                    PutRequest: {
                        Item: massageDataForDynamoDB(course),
                    },
                }
            }),
        },
    }

    await client.send(new BatchWriteItemCommand(params))
}

const massageDataForDynamoDB = (data) => {
    const massagedData = data

    Object.keys(data).forEach((key) => {
        massagedData[key] = setDynamoAttributeWithType(massagedData[key])
    })

    return massagedData
}

const setDynamoAttributeWithType = (obj) => {
    switch (typeof obj) {
    case 'string':
        return { S: obj.toString() }
    case 'number':
        return { N: obj.toString() }
    case 'object':
        return { M: obj.toString() }
    default:
        console.warn(`Unhandled type ${typeof obj} for obj`, obj)
        return null
    }
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param arr {Array} Array to split
 * @param maxSize {Integer} Size of every group
 */
const chunkArray = (arr, maxSize) => {
    const results = []
    
    while (arr.length) {
        results.push(arr.splice(0, maxSize))
    }
    
    return results
}
