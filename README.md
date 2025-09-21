# NestJS OCR Demo Service

A powerful OCR (Optical Character Recognition) service built with NestJS that extracts text from images using Tesseract.js. The service supports both English and Vietnamese languages and uses Redis with BullMQ for asynchronous job processing.

## Features

- 🖼️ **Image Text Extraction**: Extract text from uploaded images
- 🌍 **Multi-language Support**: Supports English and Vietnamese text recognition
- ⚡ **Asynchronous Processing**: Queue-based processing using BullMQ
- 📊 **Job Status Tracking**: Real-time job status monitoring
- 🚀 **REST API**: Simple HTTP endpoints for easy integration
- 💾 **Redis Storage**: Efficient result caching and job management

## Tech Stack

- **Framework**: NestJS
- **OCR Engine**: Tesseract.js
- **Queue System**: BullMQ
- **Database**: Redis
- **File Upload**: Multer
- **Language**: TypeScript

## Prerequisites

- Node.js (version 16 or higher)
- Redis server
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nest-ocr-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start Redis server:
```bash
redis-server
```

4. Set up environment variables (optional):
```bash
export PORT=3000
export REDIS_HOST=localhost
export REDIS_PORT=6379
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The application will start on `http://localhost:3000` (or the port specified in PORT environment variable).

## API Endpoints

### 1. Upload Image for OCR Processing

**POST** `/ocr/scan`

Upload an image file to extract text from it.

**Request:**
- Content-Type: `multipart/form-data`
- Body: Form data with a file field named `file`

**Response:**
```json
{
  "jobId": "1234567890"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/ocr/scan \
  -F "file=@/path/to/your/image.jpg"
```

### 2. Get OCR Result

**GET** `/ocr/result/:id`

Retrieve the OCR processing result by job ID.

**Parameters:**
- `id`: Job ID returned from the scan endpoint

**Response:**

**Processing:**
```json
{
  "status": "processing"
}
```

**Success:**
```json
{
  "status": "done",
  "text": "Extracted text from the image"
}
```

**Error:**
```json
{
  "status": "error",
  "error": "Error message"
}
```

**Example:**
```bash
curl http://localhost:3000/ocr/result/1234567890
```

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- TIFF (.tiff)
- BMP (.bmp)
- GIF (.gif)
- WEBP (.webp)

## Language Support

The service currently supports:
- **English** (eng)
- **Vietnamese** (vie)

The trained data files (`eng.traineddata` and `vie.traineddata`) are included in the project root.

## Architecture

The application follows a modular architecture:

```
src/
├── modules/
│   └── ocr/
│       ├── ocr.controller.ts    # REST API endpoints
│       ├── ocr.service.ts       # Business logic
│       ├── ocr.processor.ts     # Background job processor
│       ├── ocr.module.ts        # Module configuration
│       └── ocr.type.ts          # TypeScript interfaces
├── common/
│   └── redis/
│       └── redis.module.ts      # Redis configuration
└── main.ts                      # Application entry point
```

## Job Processing Flow

1. **Upload**: Client uploads an image via `/ocr/scan`
2. **Queue**: Image is encoded to base64 and added to Redis queue
3. **Process**: Background worker processes the image using Tesseract.js
4. **Store**: Results are cached in Redis with 1-hour expiration
5. **Retrieve**: Client polls `/ocr/result/:id` for completion

## Configuration

### Redis Configuration

The application uses Redis for both job queuing and result storage. Configure Redis connection in the environment:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password  # if required
```

### Queue Configuration

- **Queue Name**: `ocr`
- **Result TTL**: 3600 seconds (1 hour)
- **Job Retry**: Configurable via BullMQ options

## Error Handling

The service handles various error scenarios:

- **No file uploaded**: Returns `400 Bad Request`
- **OCR processing failure**: Returns error status with message
- **Invalid job ID**: Returns `null` result
- **Redis connection issues**: Service gracefully handles connection errors

## Testing

Run the test suite:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Performance Considerations

- **Memory Usage**: Large images may consume significant memory during processing
- **Processing Time**: OCR processing time varies based on image size and complexity
- **Concurrent Jobs**: Configure BullMQ concurrency based on available resources
- **Result Caching**: Results are cached for 1 hour to improve response times

## Development

### Available Scripts

```bash
npm run start:dev      # Start in development mode with hot reload
npm run start:debug    # Start in debug mode
npm run build          # Build for production
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint
```

### Adding New Languages

To add support for additional languages:

1. Download the appropriate `.traineddata` file from [tessdata repository](https://github.com/tesseract-ocr/tessdata)
2. Place it in the project root
3. Update the language parameter in `ocr.processor.ts`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the UNLICENSED License.

## Support

For questions or issues, please open an issue in the repository or contact the development team.
