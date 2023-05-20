// Semester: 2023A
// Assessment: Assignment 2
// Author: 
//     To Bao Minh Hoang: s3978554
//     Le Viet Bao: s3979654
//     Huynh Ngoc Giang My: s3978986
//     Luu van Thien Toan: s3979512
//     Pho An Ninh: s3978162
// Acknowledgement: https://youtube.com/watch?v=991fdnSllcw&feature=share - live search bar, chatgpt, Mr Tom Huynh's RMIT Store 
async function deleteProduct(id) {
    try {
        const response = await fetch(`/product/${id}/delete`, {
            method: 'DELETE',
        });

        if (response.status === 200) {
            location.reload();
        } else {
            alert('Failed to delete product');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete product');
    }
}
