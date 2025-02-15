from imutils import face_utils
import dlib
import cv2
import lipRatio
import os
from os import listdir
import csv
from unsilence import Unsilence

def read_csv_to_list(filename):

    data_list = []

    with open(filename, 'r') as csvfile:

        reader = csv.reader(csvfile)

        for row in reader:

            data_list.append(row) 

    return data_list 


# Example usage

database_data = read_csv_to_list("database.csv")



def compareLips(imagepathUser, expectedPhoneme):
    expectedRatio = 0
    actualRatio = 0
    actualRatio = lipRatio.giveRatioHtoV(imagepathUser)
    for lists in database_data:
        if (lists[0] == expectedPhoneme):
            expectedRatio = float(lists[1])
            break

    user_ratio_vert = 1/(actualRatio)
    user_ratio_hor = actualRatio
    expected_ratio_vert = 1/(expectedRatio)
    expected_ratio_hor = expectedRatio

    if (user_ratio_vert < expected_ratio_vert and user_ratio_hor < expected_ratio_hor):
      return("Try opening your mouth more.")
    elif (user_ratio_vert > expected_ratio_vert and user_ratio_hor > expected_ratio_hor):
      return("Try closing your mouth more.")
    elif (user_ratio_vert < expected_ratio_vert):
      return("Try opening your mouth more by lowering your jaw.")
    elif (user_ratio_vert > expected_ratio_vert):
      return("Try closing your mouth more by raising your jaw.")
    elif (user_ratio_hor < expected_ratio_hor):
      return("Try widening your mouth as if you are smiling.")
    elif (user_ratio_hor > expected_ratio_hor):
      return("Try relaxing your cheek muscles to reduce the width of your mouth.")

print(compareLips('test.jpg', '3'))

##code for creating database
# temp_storage = []

# # get the path/directory
# folder_dir = "Mark Mouth Database/"
# for images in os.listdir(folder_dir):
#     print('Mark Mouth Database/' + images)
#     temp_storage.append([folder_dir+images, lipRatio.giveRatioHtoV(folder_dir+images)])


# file_path = 'database.csv'
# # Open the file in write mode ('w')
# with open(file_path, 'w', newline='') as file:
#     # Create a CSV writer object
#     writer = csv.writer(file)

#     # Write the data rows
#     writer.writerows(temp_storage)

# print(f"Data written to {file_path} successfully.")







