import { walrusService } from './services/walrus';

async function testWalrusService() {
  console.log('🐙 Testing Walrus Service...\n');

  try {
    // Test 1: Upload a small text file
    console.log('📤 Testing file upload...');
    const testContent = 'Hello Walrus! This is a test file from LOAR.';
    const testBuffer = Buffer.from(testContent, 'utf-8');

    const uploadResult = await walrusService.uploadFile(testBuffer, 'test.txt');
    console.log('✅ Upload successful!');
    console.log(`📋 Blob ID: ${uploadResult.blobId}`);
    console.log(`🌐 URL: ${uploadResult.url}`);
    console.log(`📏 Size: ${uploadResult.size} bytes\n`);

    // Test 2: Check blob info
    console.log('🔍 Testing blob info...');
    const blobInfo = await walrusService.getBlobInfo(uploadResult.blobId);
    console.log('✅ Blob info retrieved!');
    console.log(`📊 Exists: ${blobInfo.exists}`);
    console.log(`📏 Size: ${blobInfo.size} bytes`);
    console.log(`📄 Content Type: ${blobInfo.contentType || 'unknown'}\n`);

    // Test 3: Test URL generation
    console.log('🔗 Testing URL generation...');
    const generatedUrl = walrusService.getFileUrl(uploadResult.blobId);
    console.log(`✅ Generated URL: ${generatedUrl}\n`);

    // Test 4: Upload from URL (using a public image)
    console.log('🌐 Testing upload from URL (image)...');
    const imageUrl = 'https://picsum.photos/200/300.jpg';
    const urlUploadResult = await walrusService.uploadFromUrl(imageUrl);
    console.log('✅ Image upload successful!');
    console.log(`📋 Image Blob ID: ${urlUploadResult.blobId}`);
    console.log(`🌐 Image URL: ${urlUploadResult.url}`);
    console.log(`📏 Image Size: ${urlUploadResult.size} bytes\n`);

    // Test 5: Upload video from URL
    console.log('🎬 Testing video upload from URL...');
    const videoUrl = 'https://storage.cdn-luma.com/dream_machine/ecd2e5f6-20ef-4c9e-adbc-9ab3d57f2abf/43898d8d-2a37-46f2-88e6-921ac034cc3f_result4b88d8d24f4101f2.mp4';
    const videoUploadResult = await walrusService.uploadFromUrl(videoUrl);
    console.log('✅ Video upload successful!');
    console.log(`📋 Video Blob ID: ${videoUploadResult.blobId}`);
    console.log(`🌐 Video URL: ${videoUploadResult.url}`);
    console.log(`📏 Video Size: ${videoUploadResult.size} bytes\n`);

    // Test 6: Upload local temp file to compare
    console.log('🏠 Testing local file upload (using temp file)...');
    const fs = require('fs');
    const tempFiles = fs.readdirSync('.').filter((f: string) => f.startsWith('temp_') && f.endsWith('.mp4'));
    if (tempFiles.length > 0) {
      const localFile = tempFiles[0];
      console.log(`📁 Using local file: ${localFile}`);
      const localUploadResult = await walrusService.uploadLocalFile(localFile);
      console.log('✅ Local upload successful!');
      console.log(`📋 Local Blob ID: ${localUploadResult.blobId}`);
      console.log(`🌐 Local URL: ${localUploadResult.url}`);
      console.log(`📏 Local Size: ${localUploadResult.size} bytes\n`);
    } else {
      console.log('❌ No temp MP4 files found to test local upload\n');
    }

    console.log('🎉 All Walrus tests passed!');
    console.log('\n📝 Summary:');
    console.log(`• Text file blob: ${uploadResult.blobId}`);
    console.log(`• Image file blob: ${urlUploadResult.blobId}`);
    console.log(`• Video file blob: ${videoUploadResult.blobId}`);
    console.log(`• All files are now stored on Walrus testnet!`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testWalrusService().catch(console.error);

// https://aggregator.walrus-testnet.walrus.space/v1/blobs/6v8WTb4tXmhcEBAb3CD4Afhpp_W42cXnNkzJJXcJ_Vo