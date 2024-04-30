// function get_youtube_thumbnail(url, quality) {
//     if (url) {
//         var video_id, thumbnail, result;
//         if ((result = url.match(/youtube\.com.*(\?v=|\/embed\/)(.{11})/))) {
//             video_id = result.pop();
//         } else if ((result = url.match(/youtu.be\/(.{11})/))) {
//             video_id = result.pop();
//         }

//         if (video_id) {
//             if (typeof quality == 'undefined') {
//                 quality = 'high';
//             }

//             var quality_key = 'maxresdefault'; // Max quality
//             if (quality == 'low') {
//                 quality_key = 'sddefault';
//             } else if (quality == 'medium') {
//                 quality_key = 'mqdefault';
//             } else if (quality == 'high') {
//                 quality_key = 'hqdefault';
//             }

//             var thumbnail =
//                 'http://img.youtube.com/vi/' +
//                 video_id +
//                 '/' +
//                 quality_key +
//                 '.jpg';
//             return thumbnail;
//         }
//     }
//     return false;
// }

// function downloadThumbnail() {
//     var url = document.getElementById('url-yt').value;
//     var quality = document.getElementById('quality').value;
//     var thumbnailUrl = get_youtube_thumbnail(url, quality);
//     if (thumbnailUrl) {
//         var downloadLink = document.createElement('a');
//         downloadLink.href = thumbnailUrl;
//         downloadLink.download = 'thumbnail.jpg';
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//     } else {
//         alert('Invalid YouTube URL');
//     }
// }

// document
//     .getElementById('thumbnailForm')
//     .addEventListener('submit', function (event) {
//         event.preventDefault();
//         var url = document.getElementById('url').value;
//         var quality = document.getElementById('quality').value;
//         var thumbnailUrl = get_youtube_thumbnail(url, quality);
//         if (thumbnailUrl) {
//             var thumbnailElement = document.getElementById('thumbnail');
//             thumbnailElement.innerHTML = `<img src="${thumbnailUrl}" alt="YouTube Thumbnail"><br>`;
//             let localUrl =
//                 'site/content/tools/yt-thumbnail/default_thumbnail.png';
//             var downloadLink = document.createElement('a');
//             downloadLink.href = localUrl;
//             downloadLink.download = 'thumbnail.jpg';
//             downloadLink.textContent = 'Download Thumbnail';
//             // downloadLink.setAttribute("download", "");
//             thumbnailElement.appendChild(downloadLink);
//         } else {
//             document.getElementById('thumbnail').innerHTML =
//                 '<p>Invalid YouTube URL</p>';
//         }
//     });
