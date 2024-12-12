package be.pxl.services;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

/**
 * Unit test for simple App.
 */
public class MessagingServiceApplicationTests
    extends TestCase
{
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public MessagingServiceApplicationTests(String testName )
    {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite()
    {
        return new TestSuite( MessagingServiceApplicationTests.class );
    }

    /**
     * Rigourous Test :-)
     */
    public void testApp()
    {
        assertTrue( true );
    }
}
