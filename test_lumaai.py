import requests
import time
import threading
import http.server
import socketserver
import subprocess
import os
from lumaai import LumaAI
import google.generativeai as genai
import base64
from google import genai
from google.genai import types

client = genai.Client(api_key="AIzaSyDEpo_JjUAg85_PaKRqeHd2gmzoAbvjB2Q")

# Generate an image from a text prompt  
response = client.models.generate_content(
    model="gemini-2.5-flash-image-preview",
    contents="A simple cartoon drawing of a cute orange cat sitting on grass. Clean, minimal illustration with soft pastel colors. Child-friendly artwork.",
)

print("response: ",response)

# Extract the generated image
if response.candidates and response.candidates[0].content.parts:
    # Find the part with image data
    image_part = None
    for part in response.candidates[0].content.parts:
        if hasattr(part, 'inline_data') and part.inline_data:
            image_part = part
            break
        
    print("image part: ",image_part)
    
    if image_part:
        image_data = image_part.inline_data.data
        mime_type = image_part.inline_data.mime_type
        print(f"Image generated successfully! MIME type: {mime_type}")
        
        # Save the image locally
        with open("generated_image.png", "wb") as f:
            f.write(image_data)
        print("Image saved as generated_image.png")
        
        # Upload to a simple file upload service
        print("Uploading image to file service...")
        use_upload = False
        
        # Try multiple services
        services = [
            ("tmpfiles.org", "https://tmpfiles.org/api/v1/upload", "file"),
            ("catbox.moe", "https://catbox.moe/user/api.php", "fileToUpload"),
            ("file.io", "https://file.io", "file")
        ]
        
        for service_name, url, field_name in services:
            try:
                print(f"Trying {service_name}...")
                with open("generated_image.png", "rb") as f:
                    files = {field_name: f}
                    data = {"reqtype": "fileupload"} if service_name == "catbox.moe" else {}
                    
                    response = requests.post(url, files=files, data=data)
                
                if response.status_code == 200:
                    if service_name == "tmpfiles.org":
                        result = response.json()
                        if result.get("status") == "success":
                            # Use the dl URL format for direct access
                            file_url = result["data"]["url"]  # e.g., https://tmpfiles.org/12411529/generated_image.png
                            upload_url = file_url.replace("tmpfiles.org/", "tmpfiles.org/dl/")
                    elif service_name == "catbox.moe":
                        upload_url = response.text.strip()
                    elif service_name == "file.io":
                        result = response.json()
                        if result.get("success"):
                            upload_url = result["link"]
                    
                    if 'upload_url' in locals() and upload_url:
                        print(f"✅ Image uploaded to {service_name}: {upload_url}")
                        use_upload = True
                        break
                else:
                    print(f"❌ {service_name} failed: {response.status_code}")
            except Exception as e:
                print(f"❌ {service_name} error: {e}")
        
        if not use_upload:
            print("❌ All upload services failed")
        
        # Start a simple HTTP server to serve the image
        print("\nStarting local HTTP server to serve the image...")
        
        def start_server():
            handler = http.server.SimpleHTTPRequestHandler
            with socketserver.TCPServer(("", 8000), handler) as httpd:
                httpd.serve_forever()
        
        # Start server in background thread
        server_thread = threading.Thread(target=start_server, daemon=True)
        server_thread.start()
        time.sleep(2)  # Give server time to start
        
        # Only generate video if upload was successful
        if not use_upload:
            print("❌ Image upload failed. Cannot generate video.")
        else:
            # Generate video from uploaded image with LumaAI
            print("Generating video with LumaAI...")
            try:
                luma_client = LumaAI(auth_token="luma-f82ee185-4d65-49e9-a375-574744b9b851-b39f11b3-6bb1-4921-a145-8e410c7385e9")
                
                image_url = upload_url
                print(f"Using uploaded image URL: {image_url}")
                
                generation = luma_client.generations.create(
                    model="ray-flash-2", 
                    prompt="A cute cat gently swaying in a soft breeze",
                    keyframes={
                        "frame0": {
                            "type": "image",
                            "url": image_url
                        }
                    }
                )
                
                # Wait for completion
                print("Waiting for video generation...")
                completed = False
                while not completed:
                    generation = luma_client.generations.get(id=generation.id)
                    if generation.state == "completed":
                        completed = True
                    elif generation.state == "failed":
                        raise RuntimeError(f"Generation failed: {generation.failure_reason}")
                    print("Dreaming...")
                    time.sleep(3)
                
                video_url = generation.assets.video
                print(f"\nVideo generated successfully! URL: {video_url}")
                
                # Download the video
                video_response = requests.get(video_url, stream=True)
                with open(f'{generation.id}.mp4', 'wb') as file:
                    file.write(video_response.content)
                print(f"Video downloaded as {generation.id}.mp4")
                
            except Exception as e:
                print(f"Error generating video with LumaAI: {e}")
    else:
        print("No image found in response")
else:
    print("Failed to generate image with Gemini")