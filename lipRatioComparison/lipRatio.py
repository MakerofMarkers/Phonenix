from imutils import face_utils
import dlib
import cv2

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

def giveRatioHtoV(image_path):

    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 1)

    for rect in rects:
        shape = predictor(gray, rect)
        shape = face_utils.shape_to_np(shape)
        #shape is a list of list [[x,y], [x,y]]] with each member a x and y coordinate pair
        xStorage = []
        yStorage = []
        pointStorage = []
        #find max and min points 
        for spacer in range(49, 68):
            xStorage.append(shape[spacer][0])
            yStorage.append(shape[spacer][1])
            pointStorage.append(shape[spacer])

        leftLipValue = xStorage.index(min(xStorage))
        rightLipValue = xStorage.index(max(xStorage))
        topLipValue = yStorage.index(min(yStorage))
        bottomLipValue = yStorage.index(max(yStorage))


        leftLip = pointStorage[leftLipValue]
        rightLip = pointStorage[rightLipValue]
        topLip = pointStorage[topLipValue]
        bottomLip = pointStorage[bottomLipValue]
        #############################################


    try:
        ratioHtoV = (rightLip[0] - leftLip[0]) / (bottomLip[1] - topLip[1])
        return ratioHtoV
    except:
        return None
